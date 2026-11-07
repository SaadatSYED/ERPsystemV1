import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  darkMode: boolean = false;
  language: string = 'en';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.darkMode = settings.darkMode;
      this.language = settings.language;
    }
  }

  saveSettings(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const settings = {
      darkMode: this.darkMode,
      language: this.language
    };
    localStorage.setItem('user-settings', JSON.stringify(settings));
    alert('✅ Settings saved successfully!');
  }
}
