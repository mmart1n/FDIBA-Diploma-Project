import { NgModule } from '@angular/core';

import { IgxButtonModule, IgxGridModule, IgxFocusModule, IgxDialogModule, IgxSwitchModule, IgxIconModule } from 'igniteui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ManageStateAndSemestersComponent } from './manage-state-and-semesters/manage-state-and-semesters.component';
import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { ManageSpecialtiesComponent } from './manage-specialties/manage-specialties.component';
import { AdminPanelComponent } from './admin-panel.component';
import { ManageAssignmentsComponent } from './manage-assignments/manage-assignments.component';

@NgModule({
  declarations: [AdminPanelComponent, ManageUsersComponent, ManageStateAndSemestersComponent, ManageSubjectsComponent, ManageSpecialtiesComponent, ManageAssignmentsComponent],
  imports: [AdminPanelRoutingModule, IgxGridModule, IgxDialogModule, IgxFocusModule, IgxIconModule,
    ReactiveFormsModule, CommonModule, IgxButtonModule, NgbCollapseModule, SharedModule, IgxSwitchModule],
})
export class AdminPanelModule { }
