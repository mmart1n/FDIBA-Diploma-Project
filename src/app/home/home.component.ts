import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Pipe({ name: 'noSanitize' })
export class NoSanitizePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {

  }
  transform(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public html: string;
  public isLoading = true;
  private subs: Subscription;
  public connectionFailedMessage: string;

  constructor(private store: Store<fromApp.AppState>) { }

  public ngOnInit(): void {
    this.subs = this.store.select('adminManageHomePage').subscribe((manageHomePageState) => {
      this.html = manageHomePageState.currentState.text;
      this.connectionFailedMessage = manageHomePageState.connectionFailedError;
      this.isLoading = manageHomePageState.loading;
    });
  }

  public ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
