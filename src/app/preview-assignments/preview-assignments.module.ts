import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IgxInputGroupModule, IgxButtonModule, IgxSelectModule, IgxTabsModule, IgxGridModule, IgxDialogModule } from 'igniteui-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ExistingAssignmentsComponent } from './existing-assignments/existing-assignments.component';
import { PreviewAssignmentsComponent } from './preview-assignments.component';
import { ManageAssignmentsResolverService } from '../admin-panel/manage-assignments/manage-assignments.resolver.service';

const routes: Routes = [{ path: '', component: PreviewAssignmentsComponent, resolve: [ManageAssignmentsResolverService] }];

@NgModule({
  declarations: [PreviewAssignmentsComponent, ExistingAssignmentsComponent],
  imports: [RouterModule.forChild(routes), IgxInputGroupModule, ReactiveFormsModule, CommonModule,
    IgxButtonModule, IgxSelectModule, IgxTabsModule, IgxGridModule, FormsModule, IgxDialogModule, SharedModule],
})
export class PreviewAssignmentsModule { }
