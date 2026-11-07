import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Shared reusable button — use everywhere instead of raw <button>.
 *
 * <app-btn label="Save" icon="save" variant="primary" size="sm" (onClick)="save()"></app-btn>
 */
@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="'btn btn-' + variant + (size ? ' btn-' + size : '')"
      [attr.type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)">
      @if (icon) {
        <i [class]="'bi bi-' + icon + (label ? ' me-1' : '')"></i>
      }{{ label }}
    </button>
  `
})
export class AppBtnComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' |
                    'outline-primary' | 'outline-secondary' | 'outline-danger' | 'link' = 'primary';
  @Input() size: 'sm' | 'lg' | '' = 'sm';
  @Input() icon  = '';
  @Input() label = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
