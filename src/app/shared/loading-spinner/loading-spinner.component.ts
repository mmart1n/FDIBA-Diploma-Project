import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `<div class="my-overlay">
    <igx-circular-bar [indeterminate]="true" [textVisibility]="false"></igx-circular-bar>
  </div>`,
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinner { }
