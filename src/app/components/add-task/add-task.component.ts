import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  formSubmitted: boolean = false;
  taskId: number | null = null;

  profileImage: string | ArrayBuffer | null = null;
  defaultImage: string = 'https://www.w3schools.com/howto/img_avatar.png'; // 👈 Default Avatar

  employee: any;
  isViewMode: any;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      employeeNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      status: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      profileImage: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.taskId = +idParam;
      this.loadTaskById(this.taskId);
    }

    this.route.queryParams.subscribe(params => {
      this.isViewMode = params['view'] === 'true';
      if (this.isViewMode) {
        this.taskForm.disable();
      }
    });
  }

  saveTask(): void {
    this.formSubmitted = true;

    if (this.taskForm.invalid) return;

    const taskData = {
      ...this.taskForm.value,
      employeeNumber: this.taskForm.value.employeeNumber.trim(),
      firstName: this.taskForm.value.firstName.trim(),
      lastName: this.taskForm.value.lastName.trim(),
      email: this.taskForm.value.email.toLowerCase().trim(),
      designation: this.taskForm.value.designation.trim(),
      status: this.taskForm.value.status.trim(),
      address: this.taskForm.value.address.trim(),
      description: this.taskForm.value.description.trim(),
      profileImage: this.extractBase64(this.taskForm.value.profileImage)
    };

    if (this.taskId) {
      const updated = { ...taskData, id: this.taskId };
      this.taskService.updateTask(this.taskId, updated).subscribe({
        next: () => {
          this.router.navigate(['/tasks'], {
            state: { message: '✅ Employee updated successfully!' }
          });
        },
        error: (err) => console.error('❌ Update failed:', err)
      });
    } else {
      this.taskService.addTask(taskData).subscribe({
        next: () => {
          this.router.navigate(['/tasks'], {
            state: { message: '✅ Record created successfully' }
          });
        },
        error: (err) => console.error('❌ Add failed:', err)
      });
    }
  }

  extractBase64(dataUrl: string): string {
    if (!dataUrl) return '';
    const parts = dataUrl.split(',');
    return parts.length === 2 ? parts[1].trim() : dataUrl.trim();
  }

  loadTaskById(id: number): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue(task);
        if (task.profileImage) {
          this.profileImage = task.profileImage;
        }
      },
      error: () => {
        alert('❌ Task not found!');
        this.router.navigate(['/tasks']);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg'];
      const maxSizeMB = 1;

      if (!allowedTypes.includes(file.type)) {
        alert('❌ Only JPEG/PNG allowed.');
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`❌ Max file size is ${maxSizeMB}MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
        this.taskForm.patchValue({ profileImage: reader.result }); // 👈 Save in form
      };
      reader.readAsDataURL(file);
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
