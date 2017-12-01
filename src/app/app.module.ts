import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { CustomOption } from './custom-toastr-option';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(rootRouterConfig),
    CdkTableModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    ToastModule.forRoot()
  ],
  providers: [
    {provide: ToastOptions, useClass: CustomOption}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
