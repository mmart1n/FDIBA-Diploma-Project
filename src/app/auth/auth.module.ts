import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { IgxInputGroupModule, IgxIconModule, IgxButtonModule, IgxDialogModule } from 'igniteui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: '', component: AuthComponent }];

@NgModule({
  declarations: [AuthComponent],
  imports: [RouterModule.forChild(routes), IgxInputGroupModule, SharedModule,
    IgxIconModule, ReactiveFormsModule, CommonModule, IgxButtonModule, IgxDialogModule],
})
export class AuthModule { }
