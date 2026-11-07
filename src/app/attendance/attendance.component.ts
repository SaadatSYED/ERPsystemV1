import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AttendanceRecord {
  day: number;
  status: 'present' | 'absent' | 'half-day' | 'holiday' | 'weekend' | '';
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {
  currentMonth = new Date(2026, 10); // November 2026
  monthName = this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  employees = [
    { id: 1, name: 'Ali Hassan',      designation: 'Developer' },
    { id: 2, name: 'Sara Khan',       designation: 'Designer' },
    { id: 3, name: 'Usman Malik',     designation: 'Manager' },
    { id: 4, name: 'Ayesha Raza',     designation: 'HR Officer' },
    { id: 5, name: 'Bilal Ahmed',     designation: 'QA Engineer' }
  ];

  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Build calendar days for November 2026 (starts on Sunday = index 6)
  get calendarDays(): { day: number | null; weekday: number }[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Convert Sunday=0 to Monday-based index
    const startOffset = (firstDay + 6) % 7;
    const cells: { day: number | null; weekday: number }[] = [];
    for (let i = 0; i < startOffset; i++) cells.push({ day: null, weekday: i });
    for (let d = 1; d <= daysInMonth; d++) {
      const wd = (new Date(year, month, d).getDay() + 6) % 7;
      cells.push({ day: d, weekday: wd });
    }
    return cells;
  }

  // Dummy attendance — deterministic per employee
  getStatus(empId: number, day: number | null): string {
    if (!day) return '';
    const wd = (new Date(2026, 10, day).getDay() + 6) % 7;
    if (wd >= 5) return 'weekend';
    if (day === 9 || day === 25) return 'holiday';
    const seed = (empId * 7 + day * 3) % 10;
    if (seed < 7) return 'present';
    if (seed < 9) return 'absent';
    return 'half-day';
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = {
      present: 'P', absent: 'A', 'half-day': 'H', holiday: '🎉', weekend: '—', '': ''
    };
    return map[s] ?? '';
  }

  getSummary(empId: number) {
    let present = 0, absent = 0, half = 0;
    for (let d = 1; d <= 30; d++) {
      const s = this.getStatus(empId, d);
      if (s === 'present') present++;
      else if (s === 'absent') absent++;
      else if (s === 'half-day') half++;
    }
    return { present, absent, half };
  }
}
