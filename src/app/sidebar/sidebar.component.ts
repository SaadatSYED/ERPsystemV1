import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // 🔹 Receive dark mode state from parent
  @Input() isDarkMode: boolean = false;

  // 🔹 Menu items dynamically
  menuItems = [
    { label: 'Home', link: '/home', icon: 'bi-house-door' },
    { label: 'Task List', link: '/tasks', icon: 'bi-list-task' },
    { label: 'Settings', link: '/setting', icon: 'bi-gear' }
  ];
}
