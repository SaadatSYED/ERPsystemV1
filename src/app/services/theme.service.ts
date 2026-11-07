import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTheme();
  }

  // 🌙 Toggle dark mode
  toggleTheme(): void {
    const newTheme = !this.darkModeSubject.value;
    this.darkModeSubject.next(newTheme);
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  // 🌙 Set specific theme
  setTheme(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    this.applyTheme(isDark);
    this.saveTheme(isDark);
  }

  // 🌙 Get current theme
  getCurrentTheme(): boolean {
    return this.darkModeSubject.value;
  }

  // 🌙 Apply theme to DOM
  private applyTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }

  // 🌙 Save theme to localStorage
  private saveTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // 🌙 Load theme from localStorage
  private loadTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.darkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }
} 