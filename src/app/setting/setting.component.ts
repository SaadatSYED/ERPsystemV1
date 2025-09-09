import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'] // ✅ this must be correct
})
export class SettingComponent implements OnInit {
save() {
throw new Error('Method not implemented.');
}

  darkMode: boolean = false;
  language: string = 'en';

  ngOnInit(): void {
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.darkMode = settings.darkMode;
      this.language = settings.language;
    }
  }

  saveSettings(): void {
    const settings = {
      darkMode: this.darkMode,
      language: this.language
    };

    localStorage.setItem('user-settings', JSON.stringify(settings));
    alert('✅ Settings saved successfully!');
  }
}
