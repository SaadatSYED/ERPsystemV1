import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  taskForm!: FormGroup;
  taskId!: number;
  isViewMode = false;
  formSubmitted: boolean = false; // ✅ Flag to show validation errors

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}
  

  ngOnInit() {
      this.taskForm = this.fb.group({
      employeeNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      designation: ['', Validators.required],
      status: ['', Validators.required],
      address: ['', Validators.required],
        description: [''] // ✅ NEW
    });

      this.route.queryParams.subscribe(params => {
      this.isViewMode = params['view'] === 'true';
      if (this.isViewMode) {
        this.taskForm.disable();
      }
    });

    //id ai  task list se
      const idParam = this.route.snapshot.paramMap.get('id');
      if (!idParam || isNaN(+idParam)) {
      alert('Invalid ID');
      this.router.navigate(['/tasks']);
      return;
    }


      this.taskId = +idParam;
      this.loadTaskById(this.taskId);
  
  }

      updateTask(): void {
        
      if (this.taskForm.valid) {
      const updatedTask = {
      ...this.taskForm.value,
      id: this.taskId, // ✅ IMPORTANT: id bhejna zaroori hai backend ko
      employeeNumber: this.taskForm.value.employeeNumber.trim(),
      email: this.taskForm.value.email.toLowerCase().trim(),
      firstName: this.taskForm.value.firstName.trim(),
      lastName: this.taskForm.value.lastName?.trim() || '',
      designation: this.taskForm.value.designation.trim(),
      status: this.taskForm.value.status.trim(),
      address: this.taskForm.value.address.trim(),
      description: this.taskForm.value.description.trim()  // ✅ NEW
    };

     // ✅ HTTP Call to update
      this.taskService.updateTask(this.taskId, updatedTask).subscribe({
      next: (res) => {
        this.router.navigate(['/tasks'], {
          state: { message: '✅ Employee updated successfully!' }
        });
      },
        error: (error) => {
        console.error('❌ Error while updating employee:', error);
      }
    });
  }
}

       loadTaskById(id: number): void {
       this.taskService.getTaskById(id).subscribe({
       next: (task) => {
       this.taskForm.patchValue(task);
      },
       error: () => {
       alert('❌ Task not found!');
       this.router.navigate(['/tasks']);
      }
    });
  }

        cancel() {
        this.router.navigate(['/tasks']);
  }
}
