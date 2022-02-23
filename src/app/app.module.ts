import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import { MultifactorauthComponent } from './shared/multifactorauth/multifactorauth.component';
import { NgOtpInputModule } from 'ng-otp-input';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CountdownModule } from 'ngx-countdown';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MultifactorauthComponent
  ],
  imports: [
    BrowserModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    NgOtpInputModule,
    DialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CountdownModule


  ],
  exports: [
    NgOtpInputModule,
    DialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
