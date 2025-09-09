import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTaskListComponent } from './table-task-list.component';

describe('TableTaskListComponent', () => {
  let component: TableTaskListComponent;
  let fixture: ComponentFixture<TableTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableTaskListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
