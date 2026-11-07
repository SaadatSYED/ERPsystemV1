import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef;
  @ViewChild('barCanvas') barCanvas!: ElementRef;

  employees: any[] = [];
  loading = true;

  get totalEmployees()    { return this.employees.length; }
  get activeEmployees()   { return this.employees.filter(e => e.status === 'Active').length; }
  get inactiveEmployees() { return this.employees.filter(e => e.status !== 'Active').length; }
  get recentEmployees()   { return [...this.employees].reverse().slice(0, 5); }

  constructor(
    private taskService: TaskService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.taskService.getAllTask().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => this.renderCharts(), 100);
        }
      },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit() {}

  renderCharts() {
    this.renderDoughnut();
    this.renderBar();
  }

  renderDoughnut() {
    if (!this.doughnutCanvas) return;
    new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [this.activeEmployees, this.inactiveEmployees],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%'
      }
    });
  }

  renderBar() {
    if (!this.barCanvas) return;
    const desigMap: Record<string, number> = {};
    this.employees.forEach(e => {
      const d = e.designation || 'Other';
      desigMap[d] = (desigMap[d] || 0) + 1;
    });
    const sorted = Object.entries(desigMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: sorted.map(([k]) => k),
        datasets: [{
          label: 'Employees',
          data: sorted.map(([, v]) => v),
          backgroundColor: '#3b82f6',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}
