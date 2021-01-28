import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent, NoSanitizePipe } from './home.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent, NoSanitizePipe],
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
})
export class HomeModule { }
