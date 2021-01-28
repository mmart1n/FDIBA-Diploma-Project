import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }
  public siteWorking = true;

  ngOnInit(): void {
    this.store.select('adminManageHomePage').subscribe((stateAndSemesterState) => {
      this.siteWorking = stateAndSemesterState.currentState.working;
    })
  }

}
