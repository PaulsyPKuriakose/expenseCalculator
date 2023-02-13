import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from '../model/department.model';
import { Employee } from '../model/employee.model';
import { Manager } from '../model/manager.model';
import { Billing, Roles } from '../model/role.enum';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  departments: Department[] = [];
  deptData: Department = new Department();

  constructor(private router: Router) {
    //departments
    if (
      this.router.getCurrentNavigation()?.extras?.state?.departments !=
      (null || undefined)
    ) {
      this.departments =
        this.router.getCurrentNavigation()?.extras?.state?.departments;
    }
    if (
      this.router.getCurrentNavigation()?.extras?.state?.departmentData !=
      (null || undefined)
    ) {
      this.deptData =
        this.router.getCurrentNavigation()?.extras?.state?.departmentData;
    }
  }

  ngOnInit(): void {
    this.initialize();
  }
  getDeptAllocation(dept: Department, show: boolean = true) {
    dept.allocation = 300;
    dept.deptwiseAllocationVisible = !show;
    dept.members.forEach((member) => {
      let billingamount = 0;

      billingamount = this.getManagerWiseAllocation(member, false);
      member.allocation = billingamount;
      dept.allocation = dept.allocation + billingamount;
    });
  }
  getManagerWiseAllocation(manager: Manager, show: boolean = true) {
    let allocation = 0;

    manager.memberWiseAllocationVisible = !show;

    if (manager?.name) {
      allocation = Billing.Manager;
    }
    allocation = allocation + this.getReporteeAllocation(manager.reportees);
    manager.allocation = allocation;
    return allocation;
  }
  getReporteeAllocation(reportees: Employee[]) {
    let billingamount = 0;
    reportees.forEach((emp) => {
      billingamount = billingamount + emp.billing;
    });
    return billingamount;
  }
  initialize() {
    if (this.departments == null || this.departments.length == 0) {
      let department = new Department();
      department.id = 1;
      department.name = 'Department1';
      department.manager = 'ManagerA';
      department.members = [];
      let member = new Manager();
      member.id = 1;
      member.name = 'ManagerB';
      member.reportees = [];
      let emp = new Employee();
      emp.id = 1;
      emp.name = 'Dev1';
      emp.role = Roles.Developer;
      emp.billing = Billing.Developer;
      member.reportees.push(emp);
      emp = new Employee();
      emp.id = 1;
      emp.name = 'QA1';
      emp.role = Roles.QA;
      emp.billing = Billing.QA;
      member.reportees.push(emp);
      department.members.push(member);
      this.departments.push(department);
    }
  }
  toggleAccordian(event: any, index: number, dept: Department) {
    if (dept.isCollapsed) {
      dept.isCollapsed = false;
    } else {
      dept.isCollapsed = true;
    }
  }
}
