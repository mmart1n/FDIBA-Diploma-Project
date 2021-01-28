import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserPanelRoutingModule } from './user-panel-routing.module';
import { UserAssignmentsComponent } from './user-assignments/user-assignments.component';
import { UserPanelComponent } from './user-panel.component';
import { IgxInputGroupModule, IgxIconModule, IgxButtonModule, IgxGridModule, IgxDialogModule } from 'igniteui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [UserPanelComponent, ChangePasswordComponent, UserAssignmentsComponent],
  imports: [UserPanelRoutingModule, IgxInputGroupModule, IgxIconModule,
    ReactiveFormsModule, CommonModule, IgxButtonModule, NgbCollapseModule, SharedModule, IgxGridModule, IgxDialogModule],
})
export class UserPanelModule { }
