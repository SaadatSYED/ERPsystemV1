import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../../shared/toast/toast.component';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  standalone: true,
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastComponent, BreadcrumbComponent]
})
export class FullLayoutComponent {}
