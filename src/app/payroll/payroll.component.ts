import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppBtnComponent } from '../shared/app-btn/app-btn.component';

interface PayrollRecord {
  id: number;
  employee: string;
  designation: string;
  month: string;
  basic: number;
  allowances: number;
  deductions: number;
  net: number;
}

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, AppBtnComponent],
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent {
  selectedSlip: PayrollRecord | null = null;

  payrollData: PayrollRecord[] = [
    { id: 1,  employee: 'Ali Hassan',  designation: 'Developer',   month: 'November 2026', basic: 85000, allowances: 15000, deductions: 8500,  net: 91500  },
    { id: 2,  employee: 'Sara Khan',   designation: 'Designer',    month: 'November 2026', basic: 70000, allowances: 12000, deductions: 7000,  net: 75000  },
    { id: 3,  employee: 'Usman Malik', designation: 'Manager',     month: 'November 2026', basic: 120000,allowances: 25000, deductions: 14000, net: 131000 },
    { id: 4,  employee: 'Ayesha Raza', designation: 'HR Officer',  month: 'November 2026', basic: 65000, allowances: 10000, deductions: 6500,  net: 68500  },
    { id: 5,  employee: 'Bilal Ahmed', designation: 'QA Engineer', month: 'November 2026', basic: 72000, allowances: 12000, deductions: 7200,  net: 76800  },
    { id: 6,  employee: 'Ali Hassan',  designation: 'Developer',   month: 'October 2026',  basic: 85000, allowances: 15000, deductions: 8500,  net: 91500  },
    { id: 7,  employee: 'Sara Khan',   designation: 'Designer',    month: 'October 2026',  basic: 70000, allowances: 12000, deductions: 7000,  net: 75000  },
    { id: 8,  employee: 'Usman Malik', designation: 'Manager',     month: 'October 2026',  basic: 120000,allowances: 25000, deductions: 14000, net: 131000 },
    { id: 9,  employee: 'Ali Hassan',  designation: 'Developer',   month: 'September 2026',basic: 85000, allowances: 15000, deductions: 8500,  net: 91500  },
    { id: 10, employee: 'Sara Khan',   designation: 'Designer',    month: 'September 2026',basic: 70000, allowances: 12000, deductions: 7000,  net: 75000  }
  ];

  viewSlip(record: PayrollRecord): void {
    this.selectedSlip = record;
  }

  closeSlip(): void {
    this.selectedSlip = null;
  }

  printSlip(): void {
    if (isPlatformBrowser(this.constructor as any)) {
      window.print();
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  print(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  formatCurrency(val: number): string {
    return 'PKR ' + val.toLocaleString();
  }
}
