import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageHomePageComponent } from './manage-home-page.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IgxButtonModule, IgxSelectModule } from 'igniteui-angular';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate-guard.service';

const routes: Routes = [{ path: '', component: ManageHomePageComponent, canDeactivate: [CanDeactivateGuard], }];

@NgModule({
  declarations: [ManageHomePageComponent],
  imports: [RouterModule.forChild(routes), CommonModule, HttpClientModule, FormsModule, IgxButtonModule, EditorModule, IgxSelectModule, SharedModule],
})
export class ManageHomePageModule { }
