import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Department } from '../model/department.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  departments: Department[] = [];
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(path: string) {
    this.router.navigate([path], {
      state: { departments: this.departments },
    });
  }
}
