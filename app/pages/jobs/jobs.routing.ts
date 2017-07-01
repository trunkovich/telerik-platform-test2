import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { JobsListComponent } from './jobs-list/jobs-list.component';

export const routes: Routes = [
  { path: '', component: JobsListComponent },
  // {path: 'forgot-password', component: ForgotPasswordComponent},
  { path: '**', pathMatch: 'full', redirectTo: './' }
];

export const jobsComponents = [ JobsListComponent ];

@NgModule({
  imports: [ NativeScriptRouterModule.forChild(routes) ],
  exports: [ NativeScriptRouterModule ]
})
export class JobsRoutingModule {
}