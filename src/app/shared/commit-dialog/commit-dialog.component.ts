import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-commit-dialog',
  templateUrl: './commit-dialog.component.html',
  styleUrls: ['./commit-dialog.component.scss']
})
export class CommitDialogComponent implements OnInit, OnDestroy {
  @ViewChild("dialog", { static: true }) public dialog: IgxDialogComponent;
  @ViewChild("dialogGrid", { read: IgxGridComponent, static: true }) public dialogGrid: IgxGridComponent;
  @Input() transactionsData;
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() commitData = new EventEmitter<boolean>();

  private _opened: boolean;
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.subscription1 = this.dialog.onOpen.subscribe(() => {
      this.dialogGrid.reflow();
    });
    this.subscription2 = this.dialog.onClose.subscribe(() => {
      this.opened = false;
    });
  }

  @Input() get opened() {
    return this._opened;
  }

  set opened(value: boolean) {
    this._opened = value;
    this.openedChange.emit(this._opened);
  }

  public commit(): void {
    this.commitData.emit(true);
    this.opened = false;
  }

  public discard(): void {
    this.commitData.emit(false);
    this.opened = false;
  }

  public close(): void {
    this.opened = false;
  }

  public stateFormatter(value: string): string {
    return JSON.stringify(value);
  }

  public typeFormatter(value: string): string {
    return value.toUpperCase();
  }

  public classFromType(type: string): string {
    return `transaction--${type.toLowerCase()}`;
  }

  ngOnDestroy(): void {
    this.opened = false;
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }

}
