import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, PaginatorModule],
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  filteredTaskList: any[] = [];
  searchKeyword: string = '';
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  selectAll: boolean = false;
  first: number = 0;
  rows: number = 3;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    const currentState = window.history.state;
    if (currentState?.message) {
      this.toastMessage = currentState.message;
      this.toastType = 'success';
      setTimeout(() => (this.toastMessage = ''), 2000);
    }
    this.getAllTasks();
  }

  getAllTasks(): void {
    this.taskService.getAllTask().subscribe({
      next: (data) => {
        this.tasks = data.map(task => ({ ...task, selected: false }));
        this.filteredTaskList = [...this.tasks];
      },
      error: (err) => {
        console.error('❌ Failed to load tasks:', err);
        this.toastMessage = '❌ Failed to load employee list!';
        this.toastType = 'error';
      }
    });
  }

  refreshTasks(): void {
    this.searchKeyword = '';
    this.getAllTasks();
    this.first = 0;
    this.toastMessage = '🔁 Task list refreshed!';
    this.toastType = 'success';
    setTimeout(() => (this.toastMessage = ''), 2000);
  }

  exportTasks(): void {
    const selectedTasks = this.tasks.filter(task => task.selected);
    if (selectedTasks.length === 0) {
      this.toastMessage = '❌ Please select at least one employee to download!';
      this.toastType = 'error';
      setTimeout(() => (this.toastMessage = ''), 3000);
      return;
    }
    const taskData = selectedTasks.map(task => ({
      employeeNumber: task.employeeNumber,
      firstName: task.firstName,
      lastName: task.lastName,
      email: task.email,
      designation: task.designation,
      status: task.status,
      address: task.address,
      description: task.description
    }));
    this.downloadAsCSV(taskData, `selected_employees_${selectedTasks.length}`);
    this.toastMessage = `✅ Downloaded ${selectedTasks.length} employee(s)!`;
    this.toastType = 'success';
    setTimeout(() => (this.toastMessage = ''), 3000);
  }

  private downloadAsCSV(data: any[], filename: string): void {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onSearch(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    this.filteredTaskList = this.tasks.filter(task =>
      Object.values(task).some(value =>
        value?.toString().toLowerCase().includes(keyword)
      )
    );
    this.first = 0;
  }

  filteredTasks(): any[] {
    const start = this.first;
    const end = start + this.rows;
    return this.filteredTaskList.slice(start, end);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  addTask(): void {
    this.router.navigate(['/task-form']);
  }

  editTask(taskId: number): void {
    this.router.navigate(['/task-form', taskId]);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          alert('✅ Employee deleted successfully!');
          this.getAllTasks();
        },
        error: (err) => {
          console.error('❌ Failed to delete employee:', err);
          alert('❌ Could not delete. Please try again.');
        }
      });
    }
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/task-form', taskId], {
      queryParams: { view: true }
    });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }

  Math = Math;

  goToFirstPage(): void {
    this.first = 0;
  }

  goToPreviousPage(): void {
    this.first = Math.max(0, this.first - this.rows);
  }

  goToNextPage(): void {
    if (this.first + this.rows < this.filteredTaskList.length) {
      this.first += this.rows;
    }
  }

  goToLastPage(): void {
    this.first = Math.floor((this.filteredTaskList.length - 1) / this.rows) * this.rows;
  }

  onRowsChange(): void {
    this.first = 0;
  }

  onSelectAllChange(): void {
    this.tasks.forEach(task => task.selected = this.selectAll);
  }

  onTaskSelectChange(): void {
    this.selectAll = this.tasks.every(task => task.selected);
  }
}
