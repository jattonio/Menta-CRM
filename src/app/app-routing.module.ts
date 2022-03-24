import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { Role } from './auth/models';
// import { HomeComponent } from './home';
// import { AdminComponent } from './admin';
// import { LoginComponent } from './login';
// import { AuthGuard } from './_helpers';
// import { Role } from './_models';

const appRoutes: Routes = [
    {
      path: 'dashboard',
      loadChildren: () => 
        import('./main/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
    },
    // {
    //   path: 'apps',
    //   loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
    //   canActivate: [AuthGuard]
    // },
    {
      path: 'pages',
      loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
      path: 'ui',
      loadChildren: () => import('./main/ui/ui.module').then(m => m.UIModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'components',
      loadChildren: () => import('./main/components/components.module').then(m => m.ComponentsModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'extensions',
      loadChildren: () => import('./main/extensions/extensions.module').then(m => m.ExtensionsModule),
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
    },
    {
      path: '',
      redirectTo: '/dashboard/ecommerce',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
    }
  ];
// const routes: Routes = [
//     {
//         path: '',
//         component: HomeComponent,
//         canActivate: [AuthGuard]
//     },
//     {
//         path: 'admin',
//         component: AdminComponent,
//         canActivate: [AuthGuard],
//         data: { roles: [Role.Admin] }
//     },
//     {
//         path: 'login',
//         component: LoginComponent
//     },

//     // otherwise redirect to home
//     { path: '**', redirectTo: '' }
// ];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
              scrollPositionRestoration: 'enabled', // Add options right here
              relativeLinkResolution: 'legacy'
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
