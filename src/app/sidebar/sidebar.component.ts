import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard',  link: '/home',       icon: 'bi-speedometer2' },
    { label: 'Employees',  link: '/tasks',       icon: 'bi-people' },
    { label: 'Attendance', link: '/attendance',  icon: 'bi-calendar-check' },
    { label: 'Leave',      link: '/leave',       icon: 'bi-calendar-x' },
    { label: 'Payroll',    link: '/payroll',     icon: 'bi-cash-stack' },
    { label: 'Reports',    link: '/reports',     icon: 'bi-bar-chart' },
    { label: 'Settings',   link: '/setting',     icon: 'bi-gear' }
  ];
}
