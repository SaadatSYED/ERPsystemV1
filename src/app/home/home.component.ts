import {
  Component, OnInit, AfterViewInit, ElementRef, ViewChild,
  Inject, PLATFORM_ID, ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { AppBtnComponent } from '../shared/app-btn/app-btn.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, AppBtnComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;
  @ViewChild('barCanvas')      barCanvas!: ElementRef;

  employees: any[] = [];
  loading = true;
  chartsRendered = false;
  private doughnutChart?: Chart;
  private barChart?: Chart;

  get total()    { return this.employees.length; }
  get active()   { return this.employees.filter(e => e.status === 'Active').length; }
  get inactive() { return this.employees.filter(e => e.status !== 'Active').length; }
  get recent()   { return [...this.employees].reverse().slice(0, 5); }
  get newThisMonth() {
    const now = new Date();
    return this.employees.filter(e => {
      const d = e.createdAt ? new Date(e.createdAt) : null;
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }

  kpis = [
    { label: 'Total Employees', key: 'total',    icon: 'bi-people-fill',      color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Active',          key: 'active',   icon: 'bi-check-circle-fill', color: '#10b981', bg: '#ecfdf5' },
    { label: 'Inactive',        key: 'inactive', icon: 'bi-dash-circle-fill',  color: '#ef4444', bg: '#fef2f2' },
    { label: 'New This Month',  key: 'newThisMonth', icon: 'bi-person-plus-fill', color: '#f59e0b', bg: '#fffbeb' }
  ];

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.taskService.getAllTask().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
        this.cdr.detectChanges();              // ensure *ngIf removes spinner & shows canvases
        setTimeout(() => this.renderCharts(), 0);
      },
      error: () => { this.loading = false; }
    });
  }

  renderCharts(): void {
    this.renderDoughnut();
    this.renderBar();
    this.chartsRendered = true;
  }

  renderDoughnut(): void {
    const el = this.doughnutCanvas?.nativeElement;
    if (!el) return;
    this.doughnutChart?.destroy();
    this.doughnutChart = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{ data: [this.active, this.inactive], backgroundColor: ['#10b981','#ef4444'], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { position: 'bottom', labels: { font: { size: 12 } } } },
        cutout: '68%'
      }
    });
  }

  renderBar(): void {
    const el = this.barCanvas?.nativeElement;
    if (!el) return;
    const map: Record<string,number> = {};
    this.employees.forEach(e => { const d = e.designation || 'Other'; map[d] = (map[d]||0)+1; });
    const sorted = Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0, 6);
    this.barChart?.destroy();
    this.barChart = new Chart(el, {
      type: 'bar',
      data: {
        labels: sorted.map(([k])=>k),
        datasets: [{
          label: 'Count',
          data: sorted.map(([,v])=>v),
          backgroundColor: '#3b82f6', borderRadius: 6, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } }
      }
    });
  }
}
