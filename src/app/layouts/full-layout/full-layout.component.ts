import { Component } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { RouterOutlet } from '@angular/router';


// full-layout.component.ts
@Component({
  standalone: true,
  selector: 'app-full-layout',
  template: `
    <app-navbar></app-navbar>
    <div class="d-flex">
      <app-sidebar></app-sidebar>
      <div class="flex-grow-1 p-3">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent]
})
export class FullLayoutComponent {}
