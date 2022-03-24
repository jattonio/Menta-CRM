import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.currentUserValue;

    // console.log('CURRENT USER', currentUser);

    // if ( !this._authenticationService.validateToken().subscribe() ){
    //   console.log('TOKEN INVÀLIDO');
    //   this._router.navigate(['/pages/authentication/login-v2'], { queryParams: { returnUrl: state.url } });      
    //   return false;
    // }

    const result = this._authenticationService.validateToken()
                .pipe(
                  tap( isAuthenticated => {
                    console.log('RESPONSE', isAuthenticated);
                    if ( !isAuthenticated ) {
                      console.log('NO ESTA AUTENTICADO');
                    }  
                  })
                );

console.log('RESULT',result);

    if (currentUser) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
        // role not authorised so redirect to not-authorized page
        this._router.navigate(['/pages/miscellaneous/not-authorized']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/pages/authentication/login-v2'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
