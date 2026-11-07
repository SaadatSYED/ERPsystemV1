import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  standalone: true,
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css'],
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastComponent]
})
export class FullLayoutComponent {}
