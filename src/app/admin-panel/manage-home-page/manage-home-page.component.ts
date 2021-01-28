import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as fromAdminManageHomePageActions from './store/admin-manage-home-page.actions';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate-guard.service';

@Component({
  selector: 'app-manage-home-page',
  templateUrl: './manage-home-page.component.html',
  styleUrls: ['./manage-home-page.component.scss']
})
export class ManageHomePageComponent implements OnInit, AfterViewInit, OnDestroy, CanDeactivateGuard {
  @ViewChild('tinymce') public tinymce;

  public html = '';
  public newHtml = '';
  public connectionFailedMessage: string;
  public siteTexts: any[];
  public siteStates: boolean[];
  public currentState: boolean = undefined;
  public isLoading = true;

  private storeSubscription: Subscription;
  private tinymceSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>, private ref: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.siteStates = [true, false];
    this.storeSubscription = this.store.select('adminManageHomePage')
      .subscribe((homePageState) => {
        this.connectionFailedMessage = homePageState.connectionFailedError || homePageState.successMessage;
        if (homePageState.statesTexts && homePageState.statesTexts.length === 2 && homePageState.currentState.text.length) {
          if (this.currentState === undefined) {
            this.currentState = homePageState.currentState.working;
          }
          this.siteTexts = homePageState.statesTexts;
          this.newHtml = homePageState.statesTexts.filter(text => text.working === this.currentState)[0].text;
          this.html = this.newHtml;
        }
      });
  }

  public ngAfterViewInit(): void {
    this.tinymceSubscription = this.tinymce.onInit.subscribe(() => {
      this.isLoading = false;
    });
  }

  public handleError(): void {
    this.store.dispatch(new fromAdminManageHomePageActions.ClearMessage());
  }

  public onPost(): void {
    this.store.dispatch(new fromAdminManageHomePageActions.UpdateStateTextStart({ status: this.currentState, content: this.newHtml }));
    document.getElementById('navbar').scrollIntoView({ behavior: 'smooth' });
  }

  public onSelectionChange(event): void {
    let shouldContinue = true;
    if (this.htmlUpdated) {
      shouldContinue = confirm('Do you want to discard the changes you made and switch the mode?');
    }
    if (shouldContinue) {
      this.handleError();
      this.currentState = event.newSelection.value;
      this.newHtml = this.siteTexts.filter(text => text.working === this.currentState)[0].text;
      this.html = this.newHtml;
    } else {
      event.cancel = true;
    }
  }

  public revertChanges(): void {
    this.newHtml = this.html;
    this.ref.markForCheck();
  }

  public get htmlUpdated(): boolean {
    return this.html.localeCompare(this.newHtml) === 0 || this.newHtml.length === 0 ? false : true;
  }

  public ngOnDestroy(): void {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
    if (this.tinymceSubscription) {
      this.tinymceSubscription.unsubscribe();
    }
    if (this.connectionFailedMessage) {
      this.handleError();
    }
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.htmlUpdated) {
      return confirm('Do you want to discard the changes you made and go back?');
    } else {
      return true;
    }
  }

}
