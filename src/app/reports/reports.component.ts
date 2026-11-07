import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('attendanceChart') attendanceChartRef!: ElementRef;
  @ViewChild('leaveChart') leaveChartRef!: ElementRef;

  activeTab: 'employees' | 'attendance' | 'leave' = 'employees';

  employees: any[] = [];
  filteredEmployees: any[] = [];
  filterStatus = '';
  filterDesignation = '';
  loading = true;

  attendanceDummy = {
    labels: ['Oct 1','Oct 2','Oct 3','Oct 4','Oct 5','Oct 6','Oct 7'],
    present: [5, 4, 5, 3, 5, 0, 0],
    absent:  [0, 1, 0, 2, 0, 0, 0]
  };

  leaveDummy = {
    labels: ['Annual', 'Sick', 'Emergency', 'Casual', 'Unpaid'],
    data:   [8, 5, 3, 4, 2]
  };

  constructor(
    private taskService: TaskService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.taskService.getAllTask().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.renderCharts(), 300);
    }
  }

  setTab(tab: 'employees' | 'attendance' | 'leave'): void {
    this.activeTab = tab;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.renderCharts(), 100);
    }
  }

  applyFilter(): void {
    this.filteredEmployees = this.employees.filter(e => {
      const matchStatus = !this.filterStatus || e.status === this.filterStatus;
      const matchDesig  = !this.filterDesignation || (e.designation || '').toLowerCase().includes(this.filterDesignation.toLowerCase());
      return matchStatus && matchDesig;
    });
  }

  exportCSV(): void {
    if (!isPlatformBrowser(this.platformId) || this.filteredEmployees.length === 0) return;
    const fields = ['employeeNumber','firstName','lastName','email','designation','status','address'];
    const csv = [
      fields.join(','),
      ...this.filteredEmployees.map(e => fields.map(f => `"${e[f] || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'employee_report.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  renderCharts(): void {
    this.renderAttendanceChart();
    this.renderLeaveChart();
  }

  renderAttendanceChart(): void {
    if (!this.attendanceChartRef) return;
    new Chart(this.attendanceChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.attendanceDummy.labels,
        datasets: [
          { label: 'Present', data: this.attendanceDummy.present, backgroundColor: '#10b981', borderRadius: 4 },
          { label: 'Absent',  data: this.attendanceDummy.absent,  backgroundColor: '#ef4444', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  renderLeaveChart(): void {
    if (!this.leaveChartRef) return;
    new Chart(this.leaveChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.leaveDummy.labels,
        datasets: [{
          data: this.leaveDummy.data,
          backgroundColor: ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  get designations(): string[] {
    return [...new Set(this.employees.map(e => e.designation).filter(Boolean))];
  }
}
