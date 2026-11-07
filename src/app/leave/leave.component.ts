import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LeaveRequest {
  id: number;
  employee: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent {
  leaveTypes = ['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Casual Leave', 'Unpaid Leave'];

  form = { type: '', from: '', to: '', reason: '' };
  submitted = false;
  successMsg = '';

  leaveRequests: LeaveRequest[] = [
    { id: 1, employee: 'Ali Hassan',  type: 'Annual Leave',    from: '2026-10-05', to: '2026-10-07', days: 3, reason: 'Family vacation', status: 'Approved' },
    { id: 2, employee: 'Sara Khan',   type: 'Sick Leave',      from: '2026-10-12', to: '2026-10-13', days: 2, reason: 'Flu & fever',     status: 'Approved' },
    { id: 3, employee: 'Usman Malik', type: 'Emergency Leave', from: '2026-10-20', to: '2026-10-20', days: 1, reason: 'Family emergency',status: 'Approved' },
    { id: 4, employee: 'Ayesha Raza', type: 'Casual Leave',    from: '2026-11-01', to: '2026-11-01', days: 1, reason: 'Personal work',  status: 'Pending'  },
    { id: 5, employee: 'Bilal Ahmed', type: 'Annual Leave',    from: '2026-11-10', to: '2026-11-14', days: 5, reason: 'Travel plans',   status: 'Pending'  },
    { id: 6, employee: 'Ali Hassan',  type: 'Unpaid Leave',    from: '2026-09-15', to: '2026-09-16', days: 2, reason: 'Personal reason',status: 'Rejected' }
  ];

  submitLeave(): void {
    this.submitted = true;
    if (!this.form.type || !this.form.from || !this.form.to || !this.form.reason.trim()) return;
    const from = new Date(this.form.from);
    const to   = new Date(this.form.to);
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
    this.leaveRequests.unshift({
      id: Date.now(),
      employee: 'You',
      type: this.form.type,
      from: this.form.from,
      to: this.form.to,
      days,
      reason: this.form.reason,
      status: 'Pending'
    });
    this.form = { type: '', from: '', to: '', reason: '' };
    this.submitted = false;
    this.successMsg = 'Leave request submitted successfully!';
    setTimeout(() => (this.successMsg = ''), 3000);
  }
}
