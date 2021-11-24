import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule, Routes } from '@angular/router';

import { AuthLoginComponent } from './login/login.component';
import { AuthRegisterComponent } from './register/register.component';
import { AuthRegisterV2Component } from './register-v2/register-v2.component';

  // routing
  const routes: Routes = [
    {
      path: 'login', component: AuthLoginComponent, data: { animation: 'auth' }
    },
    {
      path: 'register', component: AuthRegisterComponent, data: { animation: 'auth' }
    },
    {
      path: 'register-v2', component: AuthRegisterV2Component, data: { animation: 'auth' }
    }
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    // NgModule
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { 


}
