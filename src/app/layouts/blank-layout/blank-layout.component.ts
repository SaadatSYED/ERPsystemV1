import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// blank-layout.component.ts
@Component({
  standalone: true,
  selector: 'app-blank-layout',
  template: `
<router-outlet></router-outlet> <!-- no navbar/sidebar -->
  `,
  imports: [ RouterOutlet]
})
export class BlankLayoutComponent {}
