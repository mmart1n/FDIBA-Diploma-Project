import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
@Component({
  selector: 'app-select-specialty',
  templateUrl: './select-specialty.component.html',
  styleUrls: ['./select-specialty.component.scss']
})
export class SelectSpecialtyComponent implements OnInit, OnChanges, OnDestroy {

  @Output() onSpecialtySelection = new EventEmitter<any>();
  @Input() selectedSpecialty: {
    id: number,
    name?: string,
    bachelor?: boolean,
    coursesAmount?: number
  };

  @Input() width: number = 250;
  @Input() float: string = 'right';
  @Input() focus: boolean = false;
  @Input() transactions: boolean = false;
  @Input() enableLabel: boolean = true;

  public specialties: any[];
  private subscriptions: Subscription;

  public bachelors;
  public masters;
  public style: {
    width: string,
    float: string
  };

  constructor(private store: Store<fromApp.AppState>) { }

  public ngOnInit(): void {
    this.subscriptions = this.store.select('adminManageSpecialties').subscribe(x => {
      this.specialties = x.specialties;
      this.bachelors = this.specialties.filter(x => x.bachelor);
      this.masters = this.specialties.filter(x => !x.bachelor);
      if (this.selectedSpecialty && !this.selectedSpecialty.name) {
        this.selectedSpecialty = this.specialties.find(specialty => specialty.id === this.selectedSpecialty.id);
      }
    });

    this.style = {
      width: this.width + 'px',
      float: this.float
    };
  }

  public ngOnChanges(): void {
    if (this.selectedSpecialty && !this.selectedSpecialty.name && this.specialties) {
      this.selectedSpecialty = this.specialties.find(specialty => specialty.id === this.selectedSpecialty.id);
    }
  }

  public handleSelection(event): void {
    let shouldContinue = true;
    if (this.transactions) {
      shouldContinue = confirm('Whould you like to dismiss your current transactions and to switch to ' + event.newSelection.value.name + ' specialty?');
    }
    if (shouldContinue) {
      this.selectedSpecialty = event.newSelection.value;
    } else {
      event.cancel = true;
    }
    this.onSpecialtySelection.emit([shouldContinue, event.newSelection.value]);
  }

  public ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

}
