import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { OnlySignedInUsers } from './shared/guards/only-signed-in-users.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [OnlySignedInUsers]},
  {path: "auth", loadChildren: () => require("./pages/auth/auth.module")["AuthModule"]},
  {path: "jobs", loadChildren: () => require("./pages/jobs/jobs.module")["JobsModule"]},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
}