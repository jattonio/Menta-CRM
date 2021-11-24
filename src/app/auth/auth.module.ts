import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';
import { AuthLoginComponent } from 'app/auth/login/login.component';
import { AuthRoutingModule } from './auth.routing';
import { AuthRegisterComponent } from './register/register.component';
import { AuthRegisterV2Component } from './register-v2/register-v2.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthRegisterComponent,
    AuthRegisterV2Component
  ],
  imports: [
    AuthRoutingModule,
    CommonModule, 
    CoreCommonModule,
    FormsModule, 
    HttpClientModule,
    NgbModule, 
    ReactiveFormsModule, 
  ]
})
export class AuthenticationModule {}
