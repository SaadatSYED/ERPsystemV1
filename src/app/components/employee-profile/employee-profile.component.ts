import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  employee: any = null;
  loading = true;
  defaultImage = 'https://www.w3schools.com/howto/img_avatar.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/tasks']); return; }
    this.taskService.getTaskById(id).subscribe({
      next: (data) => { this.employee = data; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/tasks']); }
    });
  }

  edit(): void {
    this.router.navigate(['/task-form', this.employee.id]);
  }

  back(): void {
    this.router.navigate(['/tasks']);
  }

  getProfileImage(): string {
    if (!this.employee?.profileImage) return this.defaultImage;
    const img = this.employee.profileImage;
    return img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`;
  }
}
