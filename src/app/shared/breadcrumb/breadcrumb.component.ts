import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Crumb { label: string; url: string; }

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  crumbs: Crumb[] = [];

  private routeMap: Record<string, string> = {
    'home':       'Dashboard',
    'tasks':      'Employees',
    'task-form':  'Employee Form',
    'employee':   'Profile',
    'attendance': 'Attendance',
    'leave':      'Leave',
    'payroll':    'Payroll',
    'reports':    'Reports',
    'setting':    'Settings'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.build(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.build(e.urlAfterRedirects));
  }

  private build(url: string) {
    const parts = url.split('/').filter(Boolean).map(p => p.split('?')[0]);
    this.crumbs = [{ label: 'Home', url: '/home' }];
    let path = '';
    for (const part of parts) {
      path += '/' + part;
      const label = this.routeMap[part] || part;
      if (part !== 'home') this.crumbs.push({ label, url: path });
    }
  }
}
