import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular';
import { ReactiveFormsModule } from '@angular/forms';

import { jobsComponents, JobsRoutingModule } from './jobs.routing';
import { NativeScriptUIListViewModule } from 'nativescript-telerik-ui/listview/angular';


@NgModule({
  imports: [
    NativeScriptModule,
    JobsRoutingModule,
    NativeScriptUIListViewModule
  ],
  declarations: [ ...jobsComponents ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class JobsModule {
}
