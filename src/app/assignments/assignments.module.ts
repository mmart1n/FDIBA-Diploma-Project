import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IgxInputGroupModule, IgxButtonModule, IgxSelectModule, IgxTabsModule, IgxGridModule, IgxDialogModule } from 'igniteui-angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentsComponent } from './assignments.component';
import { SharedModule } from '../shared/shared.module';
import { ManageAssignmentsResolverService } from '../admin-panel/manage-assignments/manage-assignments.resolver.service';
import { SelectAssignmentsComponent } from './select-assignments/select-assignments.component';

const routes: Routes = [{ path: '', component: AssignmentsComponent, resolve: [ManageAssignmentsResolverService] }];

@NgModule({
  declarations: [AssignmentsComponent, SelectAssignmentsComponent],
  imports: [RouterModule.forChild(routes), IgxInputGroupModule, ReactiveFormsModule, CommonModule,
    IgxButtonModule, IgxSelectModule, IgxTabsModule, IgxGridModule, FormsModule, IgxDialogModule, SharedModule],
})
export class AssignmentsModule { }
