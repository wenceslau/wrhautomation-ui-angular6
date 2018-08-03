import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  template: `
  <!-- <div *ngIf="hasError()" class="pos">
      <hr style="height:1px;border-top:1px solid #f00">
    </div>-->
  `,
  styles: [`
    .ui-messages-error {
      margin: 0;
      margin-top: 0px;
      font-size: 8px;
    }
  `]
})
export class MessageComponent {

  @Input() error: string;
  @Input() control: FormControl;
  @Input() text: string;

  hasError(): boolean {
    return this.control.hasError(this.error) && this.control.touched;
  }

}
