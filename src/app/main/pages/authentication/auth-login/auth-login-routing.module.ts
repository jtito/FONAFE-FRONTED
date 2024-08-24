import {RouterModule, Routes} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AuthLoginComponent} from './auth-login.component';
import { NgxCaptchaModule } from '@binssoft/ngx-captcha';
import { ForgotPasswordComponent } from 'src/app/main/components/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from 'src/app/main/components/recover-password/recover-password.component';
import { ChangePasswordComponent } from 'src/app/main/components/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLoginComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'recoverPassword',
    component: RecoverPasswordComponent
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent
  }
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,NgxCaptchaModule]
})

export class AuthLoginRoutingModule{}
