import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from './loading-spinner/loading-spinner.component';
import { PanelLayoutsComponent } from './panel-layouts/panel-layouts.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { IgxIconModule, IgxSelectModule, IgxInputGroupModule, IgxProgressBarModule, IgxButtonModule, IgxGridModule, IgxDialogModule, IgxFocusModule, IgxToastModule, IgxCarouselModule } from 'igniteui-angular';
import { RouterModule } from '@angular/router';
import { GridWithTransactionsComponent } from './grid-transaction.component';
import { SelectSpecialtyComponent } from './select-specialty/select-specialty.component';
import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { CommitDialogComponent } from './commit-dialog/commit-dialog.component';
import { SelectedSpecialtySubjectsComponent } from './selected-specialty-subjects/selected-specialty-subjects.component';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    LoadingSpinner,
    PanelLayoutsComponent,
    GridWithTransactionsComponent,
    SelectSpecialtyComponent,
    ErrorMessageComponent,
    CommitDialogComponent,
    SelectedSpecialtySubjectsComponent,
    CarouselComponent
  ],
  imports: [CommonModule, NgbCollapseModule, IgxProgressBarModule, IgxFocusModule,
    IgxIconModule, RouterModule, IgxSelectModule, FormsModule, IgxInputGroupModule, IgxButtonModule, IgxGridModule, IgxDialogModule, IgxToastModule, IgxCarouselModule],
  exports: [
    PanelLayoutsComponent, GridWithTransactionsComponent, IgxFocusModule, SelectSpecialtyComponent, LoadingSpinner, ErrorMessageComponent, IgxDialogModule, CommitDialogComponent, IgxToastModule, SelectedSpecialtySubjectsComponent, IgxCarouselModule, CarouselComponent
  ],
})
export class SharedModule { }
