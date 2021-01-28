import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit, OnDestroy {

  @Input() message: string;
  @Output() close = new EventEmitter<void>();
  private timeOut: any;

  constructor() { }

  ngOnInit(): void {
    this.timeOut = setTimeout(() => {
      this.onCloseDialog();
    }, 5000);
  }

  onCloseDialog(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
  }
}
