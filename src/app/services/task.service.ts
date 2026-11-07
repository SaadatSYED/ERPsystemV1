import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:44336/api/employees';
  private storageKey = 'tasks';
  private tasksChanged = new BehaviorSubject<any[]>([]); // 🔁 Real-time update

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /** 📡 Observable for Components */
  getTasksChanged() {
    return this.tasksChanged.asObservable();
  }

  /** 🟡 Get tasks from localStorage */
  getTasks(): any[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const tasks = localStorage.getItem(this.storageKey);
    return tasks ? JSON.parse(tasks) : [];
  }

  /** ✅ Add Task with Duplicate Check */

 addTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, task);
  }

  /** ✅ getall Task with Duplicate Check */

getAllTask(): Observable<any[]> {
  return this.http.post<any[]>(`${this.apiUrl}/get-all`, {}); // ✅ empty payload
}

 // ✅ Get task by ID

getTaskById(id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/get`, { id }); // backend POST /get ke through data fetch karega
}

// ✅ Update task

updateTask(id: number, updatedTask: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/update`, updatedTask); // ✅ Use POST if your backend is using [HttpPost("update")]
}


  /** ❌ Delete Task by Index */
  
deleteTask(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete/${id}`);
}

}
