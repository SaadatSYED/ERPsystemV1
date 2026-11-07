import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showDropdown = false;
  isDarkMode = false;
  pageTitle = 'Dashboard';

  private titleMap: Record<string, string> = {
    '/home':       'Dashboard',
    '/tasks':      'Employees',
    '/employee':   'Employee Profile',
    '/attendance': 'Attendance',
    '/leave':      'Leave Management',
    '/payroll':    'Payroll',
    '/reports':    'Reports',
    '/setting':    'Settings',
    '/task-form':  'Employee Form'
  };

  constructor(
    private router: Router,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.themeService.darkMode$.subscribe(isDark => (this.isDarkMode = isDark));
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const matched = Object.keys(this.titleMap).find(k => e.url.startsWith(k));
        this.pageTitle = matched ? this.titleMap[matched] : 'ERP Pro';
      });
  }

  toggleDropdown(): void { this.showDropdown = !this.showDropdown; }
  closeDropdown(): void  { this.showDropdown = false; }
  toggleTheme(): void    { this.themeService.toggleTheme(); }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.closest('.user-menu-wrap')) this.showDropdown = false;
  }
}
