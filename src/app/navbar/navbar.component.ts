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
  showDropdown   = false;
  showNotifs     = false;
  isDarkMode     = false;
  pageTitle      = 'Dashboard';
  today          = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  notifications = [
    { icon: 'bi-person-plus-fill',   color: '#3b82f6', text: 'New employee added',           time: '2m ago'   },
    { icon: 'bi-calendar-x-fill',    color: '#f59e0b', text: 'Leave request pending approval', time: '1h ago'   },
    { icon: 'bi-cash-stack',         color: '#10b981', text: 'November payroll is ready',      time: '3h ago'   },
    { icon: 'bi-exclamation-triangle-fill', color: '#ef4444', text: 'Attendance not marked (3)', time: 'Today' }
  ];

  private titleMap: Record<string, string> = {
    '/home':       'Dashboard',   '/tasks':      'Employees',
    '/employee':   'Profile',     '/attendance': 'Attendance',
    '/leave':      'Leave',       '/payroll':    'Payroll',
    '/reports':    'Reports',     '/setting':    'Settings',
    '/task-form':  'Employee Form'
  };

  constructor(
    private router: Router,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.themeService.darkMode$.subscribe(d => (this.isDarkMode = d));
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const k = Object.keys(this.titleMap).find(k => e.url.startsWith(k));
        this.pageTitle = k ? this.titleMap[k] : 'ERP Pro';
        this.showDropdown = false;
        this.showNotifs   = false;
      });
  }

  toggleDropdown():    void { this.showDropdown = !this.showDropdown; this.showNotifs = false; }
  toggleNotifs():      void { this.showNotifs   = !this.showNotifs;   this.showDropdown = false; }
  closeAll():          void { this.showDropdown = false; this.showNotifs = false; }
  toggleTheme():       void { this.themeService.toggleTheme(); }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const t = e.target as HTMLElement;
    if (!t.closest('.topbar-dropdown-wrap')) this.closeAll();
  }
}
