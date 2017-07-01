import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { NativeScriptFormsModule, NativeScriptHttpModule } from 'nativescript-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { ApiService } from './shared/services/api.service';
import { AuthService } from './shared/services/auth.service';
import { OnlySignedInUsers } from './shared/guards/only-signed-in-users.guard';
import { reducer } from './shared/app-state/reducers/index';
import { AuthEffects } from './shared/app-state/effects/auth.effects';
import { RedirectsEffects } from './shared/app-state/effects/redirects.effects';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './pages/home/home.component';
import { JobsEffects } from './shared/app-state/effects/jobs.effects';
import { JobsService } from './shared/services/jobs.service';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptHttpModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    StoreModule.provideStore(reducer),
    EffectsModule.runAfterBootstrap(AuthEffects),
    EffectsModule.runAfterBootstrap(RedirectsEffects),
    EffectsModule.runAfterBootstrap(JobsEffects),

    AppRoutingModule
  ],
  providers: [
    ApiService,
    AuthService,
    JobsService,

    // GUARDS
    OnlySignedInUsers
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {
}
