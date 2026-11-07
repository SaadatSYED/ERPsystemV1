import { Routes } from '@angular/router';

import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { SettingComponent } from './setting/setting.component';
import { HomeComponent } from './home/home.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { LeaveComponent } from './leave/leave.component';
import { PayrollComponent } from './payroll/payroll.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'tasks', component: TaskListComponent },
      { path: 'task-form', component: AddTaskComponent },
      { path: 'task-form/:id', component: AddTaskComponent },
      { path: 'employee/:id', component: EmployeeProfileComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'leave', component: LeaveComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'setting', component: SettingComponent }
    ]
  }
];
