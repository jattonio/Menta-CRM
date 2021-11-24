import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './main/sample/home.component';
import { ErrorComponent } from './main/pages/miscellaneous/error/error.component';
import { SampleComponent } from './main/sample/sample.component';

//Modulos
// import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesModule } from './main/pages/pages.module';
import { AuthGuard } from './guards/auth.guard';

// import { NopagefoundComponent } from './nopagefound/nopagefound.component';
// import { AuthRoutingModule } from './auth/auth.routing';


const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [ AuthGuard ]
  },
  { path: 'sample', component: SampleComponent },
  { path: '', redirectTo: '/home', pathMatch:'full' },
  { 
    path: '**', component: ErrorComponent //Error 404 - Page not found
  }

//   { path: '**', component: NopagefoundComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot (routes),
    // PagesRoutingModule,
    PagesModule,
    AuthRoutingModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
