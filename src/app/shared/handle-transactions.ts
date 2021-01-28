import { IGridEditEventArgs, IgxGridComponent, IgxToastComponent, Transaction, TransactionType } from "igniteui-angular";
import { Observable, Subscription } from "rxjs";
import { CanDeactivateGuard } from "./can-deactivate-guard.service";

export class HandleTransactions implements CanDeactivateGuard {
  public mergeTransactions<T>(data: T[], transactions: Transaction[], primaryKey?: any, deleteRows: boolean = false): T[] {
    data.forEach((item: any, index: number) => {
      const rowId = primaryKey ? item[primaryKey] : item;
      const transaction = transactions.find(t => t.id === rowId);
      if (transaction && transaction.type === TransactionType.UPDATE) {
        data[index] = transaction.newValue;
      }
    });

    if (deleteRows) {
      transactions
        .filter(t => t.type === TransactionType.DELETE)
        .forEach(t => {
          const index = primaryKey ? data.findIndex(d => d[primaryKey] === t.id) : data.findIndex(d => d === t.id);
          if (0 <= index && index < data.length) {
            data.splice(index, 1);
          }
        });
    }

    data.push(...transactions
      .filter(t => t.type === TransactionType.ADD)
      .map(t => t.newValue));

    return data;
  }

  public isCommitDialogOpened: boolean = false;
  public transactionsData: Transaction[] = [];
  public grid: IgxGridComponent;
  public toast: IgxToastComponent;
  protected lastEditedCell: {
    rowIndex: number;
    columnIndex: number;
  };
  protected transactionsSubscription: Subscription;

  public onRowEditDone(ev: IGridEditEventArgs): void {
    if (ev.newValue) {
      // Check if the row has empty or invalid fields
      let res = false;
      if (Object.values(ev.newValue).some(o => o === null || o === undefined || o === '' || o < 0)) {
        res = true;
      }
      if (res) {
        this.showToast('Invalid! The record contains an empty field or negative number!', ev);
        return;
      }
    }
  }

  public getAggregatedData(): any[] {
    return this.mergeTransactions(
      JSON.parse(JSON.stringify((this.grid.data))),
      this.grid.transactions.getAggregatedChanges(true),
      this.grid.primaryKey);
  }

  public onCellEditEnter(ev: IGridEditEventArgs): void {
    this.lastEditedCell = { rowIndex: ev.cellID.rowIndex, columnIndex: ev.cellID.columnID };
  }


  public showToast(message: string, ev?: IGridEditEventArgs): void {
    this.toast.show(message);
    if (ev) {
      ev.cancel = true;
      this.grid.cdr.detectChanges();
      this.grid.navigateTo(this.lastEditedCell.rowIndex, this.lastEditedCell.columnIndex, () => {
        this.grid.getCellByColumnVisibleIndex(this.lastEditedCell.rowIndex, this.lastEditedCell.columnIndex).setEditMode(true);
      });
    }
  }

  public onUndo(): void {
    this.grid.endEdit(false);
    this.grid.transactions.undo()
  }

  public onRedo(): void {
    this.grid.endEdit(false);
    this.grid.transactions.redo()
  }

  public onCommit(): void {
    this.grid.endEdit(false);
    this.disableCommit ? this.showToast('There is an invalid transaction!') : this.isCommitDialogOpened = true;
  }

  public deleteRow(rowId: any): void {
    this.grid.endEdit(false);
    this.grid.deleteRow(rowId);
  }

  public revertDeletedRow(rowId: any): void {
    this.grid.endEdit(false);
    this.grid.transactions.clear(rowId);
  }

  public get undoEnabled(): boolean {
    return this.grid.transactions.canUndo;
  }

  public get redoEnabled(): boolean {
    return this.grid.transactions.canRedo;
  }

  public get hasTransactions(): boolean {
    return this.grid.transactions.getAggregatedChanges(false).length > 0;
  }

  public get disableCommit(): boolean {
    if (!this.hasTransactions) {
      return true;
    }
    let res = false;
    this.transactionsData.forEach((data) => {
      if (Object.values(data.newValue).some(o => o === null || o === undefined || o === '' || o < 0)) {
        res = true;
      }
    });
    return res;
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.hasTransactions) {
      return confirm('Do you want to discard the changes you made and go back?');
    } else {
      return true;
    }
  }
}
