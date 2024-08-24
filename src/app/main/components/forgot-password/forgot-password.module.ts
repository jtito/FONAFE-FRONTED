import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppsRoutingModule } from '../../pages/apps/apps-routing.module';
import { AppComponent } from 'src/app/app.component';
import { ForgotPasswordComponent } from './forgot-password.component';



@NgModule({
  declarations: [
    // ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppsRoutingModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class ForgotPasswordModule{

}
// export class AppModule { }
