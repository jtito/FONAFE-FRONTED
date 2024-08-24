import {NgModule} from '@angular/core';
import {AuthLoginComponent} from './auth-login.component';
import {AuthLoginRoutingModule} from './auth-login-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    AuthLoginRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [AuthLoginComponent]
})

export class AuthLoginModule {}
