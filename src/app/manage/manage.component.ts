import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from '../model/department.model';
import { Employee } from '../model/employee.model';
import { Manager } from '../model/manager.model';
import { Billing, Roles } from '../model/role.enum';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  manageFormGroup: FormGroup;
  departments: Department[] = [];
  roles: any;
  isNewDeptRequired: boolean = false;
  isNewDeptMngrRequired: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router) {
    if (
      this.router.getCurrentNavigation()?.extras?.state?.departments !=
      (null || undefined)
    ) {
      this.departments =
        this.router.getCurrentNavigation()?.extras?.state?.departments;
    }

    this.manageFormGroup = this.formBuilder.group({
      managerName: new FormControl(null, [Validators.required]),
      department: new FormControl(null, [Validators.required]),
      hasSubManagers: new FormControl('0', [Validators.required]),
      employees: this.formBuilder.array([]),
      submanager: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.roles = Object.keys(Roles);
  }

  getEmployeeControl(): FormArray {
    return this.manageFormGroup.get('employees') as FormArray;
  }

  newEmployee(): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
    });
  }

  addEmployee() {
    this.getEmployeeControl().push(this.newEmployee());
  }

  removeEmployee(i: number) {
    this.getEmployeeControl().removeAt(i);
  }
  changeDept(e: any) {
    if (e.target.value == '') {
      this.isNewDeptRequired = true;
    } else this.isNewDeptRequired = false;
  }
  onSubmit() {
    let department = new Department();

    department = this.mapFormValuesToObject();

    this.manageFormGroup.reset();
    if (!this.validateIfDepartmentIsAlreadyExists(department)) {
      this.departments.push(this.addNewDepartment(department));
    } else {
      this.processData(department);
    }
    this.router.navigate(['summary'], {
      state: { departments: this.departments },
    });
  }
  mapFormValuesToObject() {
    let department = new Department();
    department.name = this.manageFormGroup.value.department;
    department.manager = this.manageFormGroup.value.managerName;
    department.members = [];
    if (
      this.manageFormGroup.value.employees != null &&
      this.manageFormGroup.value.employees != undefined
    ) {
      let mgr = new Manager();
      if (this.manageFormGroup.value.hasSubManagers == '1') {
        mgr.name = this.manageFormGroup.value.submanager;
        mgr.allocation = Billing.Manager;
      } else {
        mgr.allocation = 0;
      }
      mgr.reportees = [];
      this.manageFormGroup.value.employees.forEach((emp: any) => {
        let emplyoeeDetail = new Employee();
        emplyoeeDetail.name = emp.name;
        emplyoeeDetail.id = emp.id;
        emplyoeeDetail.role = emp.role;
        mgr.reportees.push(emplyoeeDetail);
      });
      department.members.push(mgr);
    }
    return department;
  }
  processData(deptdata: Department) {
    let data = new Department();
    if (this.departments != null) {
      data = this.departments.filter(
        (item) => item.name == deptdata.name && item.manager == deptdata.manager
      )[0];
      if (data != null && data.name != '') {
        data.manager = deptdata.manager;
        if (data.members == null) {
          data.members = [];
          if (deptdata.members != null) {
            deptdata.members.forEach((mem) => {
              mem.reportees.forEach((element) => {
                element.billing = this.getBilling(element.role);
              });
              data.members.push(mem);
            });
          }
        } else {
          if (deptdata.members != null) {
            deptdata.members.forEach((mem) => {
              let managerSpecificAllocation = data.members.filter(
                (mgr) => mgr.name == mem.name
              )[0];

              if (
                managerSpecificAllocation != null &&
                managerSpecificAllocation != undefined
              ) {
                mem.reportees.forEach((element) => {
                  element.billing = this.getBilling(element.role);
                  managerSpecificAllocation.reportees.push(element);
                });
              } else {
                mem.reportees.forEach((element) => {
                  element.billing = this.getBilling(element.role);
                });
                data.members.push(mem);
              }
            });
          }
        }
      }
    }

    return data;
  }
  addNewDepartment(deptdata: Department) {
    let data = new Department();
    data = this.departments.filter(
      (item) => item.name == deptdata.name && item.manager == deptdata.manager
    )[0];
    if (data == null) {
      data = new Department();
      data.name = deptdata.name;
      data.manager = deptdata.manager;
      data.allocation = Billing.Manager;
      data.members = [];
      if (deptdata.members != null) {
        deptdata.members.forEach((mem) => {
          mem.reportees.forEach((element) => {
            element.billing = this.getBilling(element.role);
          });

          data.members.push(mem);
        });
      }
    }
    return data;
  }
  validateIfDepartmentIsAlreadyExists(deptdata: Department) {
    let data = new Department();
    if (this.departments != null) {
      data = this.departments.filter(
        (item) => item.name == deptdata.name && item.manager == deptdata.manager
      )[0];
      if (data != null && data.name != '') {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  getBilling(role: string) {
    switch (role) {
      case Roles.Developer: {
        return Billing.Developer;
      }
      case Roles.QA: {
        return Billing.QA;
      }
      case Roles.Manager: {
        return Billing.Manager;
      }
      default: {
        return 0;
      }
    }
  }
}
