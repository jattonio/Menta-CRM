import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from 'app/auth/service';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _authService: AuthenticationService,
                private _router: Router ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ){

    return this._authService.validarToken()
              .pipe(
                tap( isAuthenticated => {
                  if ( !isAuthenticated ) {
                    this._router.navigateByUrl('/login');
                  }
                })
              );
  }
  
}
