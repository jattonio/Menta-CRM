import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';

  const base_url = environment.base_url;
  declare const gapi: any;

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

  //public
  public currentUser: Observable<User>;
  public auth2: any;
  //private
  private currentUserSubject: BehaviorSubject<User>;
  

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor( private _http: HttpClient, 
                private _toastrService: ToastrService,
                private _router: Router
                ) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.googleInit();
  }

  /**
   *  Inicialización de login with google
   */
  googleInit () {
    return new Promise( ( resolve, reject ) => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '934127508309-lpeq8j27mdmkjcikjpupse410l3caloh.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });        
        resolve("ok");
      });
    });

  }


  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  validarToken (): Observable<boolean> {
    const token = JSON.parse(localStorage.getItem('token')) || '';

    return this._http.get(`${environment.base_url}/login/renew`, {
      headers: {
        'x-token': token,
      }
    })
    .pipe(
      tap( ( resp: any ) => {
        localStorage.setItem('token', JSON.stringify(resp.token));
      }),
      map ( resp => true ),
      catchError( error => of( false ) )
    );
  }


  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
   login( formData: LoginForm ) {

    // const { email, password } = formData;

    console.log( formData );

    // login(email: string, password: string) {

      return this._http
        // .post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
        // {
        //   "id": 1,
        //   "email": "admin@demo.com",
        //   "firstName": "John",
        //   "lastName": "Doe",
        //   "avatar": "avatar-s-11.jpg",
        //   "role": "Admin",
        //   "token": "fake-jwt-token.1"
        // }
        .post<any>( `${environment.base_url}/login`, formData )
        .pipe(
          map(user => {

            // login successful if there's a jwt token in the response
            if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('token', JSON.stringify(user.token));

              // Display welcome toast!
              setTimeout(() => {
                this._toastrService.success(
                  'You have successfully logged in as an ' +
                    user.role +
                    ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                  '👋 Welcome, ' + user.nombre + '!',
                  { toastClass: 'toast ngx-toastr', closeButton: true }
                );
              }, 2500);

              // notify
              this.currentUserSubject.next(user);
            }

            return user;
          })
        );
  }


  /**
   * User login with Google
   *
   * @param token
   * @returns user
   */
   loginGoogle( token ) {

      return this._http
        // .post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
        // {
        //   "id": 1,
        //   "email": "admin@demo.com",
        //   "firstName": "John",
        //   "lastName": "Doe",
        //   "avatar": "avatar-s-11.jpg",
        //   "role": "Admin",
        //   "token": "fake-jwt-token.1"
        // }
        .post<any>( `${environment.base_url}/login/google`, { token } )
        .pipe(
          map(user => {

            // login successful if there's a jwt token in the response
            if (user && user.token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('token', JSON.stringify(user.token));

              // Display welcome toast!
              setTimeout(() => {
                this._toastrService.success(
                  'You have successfully logged in as an ' +
                    user.role +
                    ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                  '👋 Welcome, ' + user.nombre + '!',
                  { toastClass: 'toast ngx-toastr', closeButton: true }
                );
              }, 2500);

              // notify
              this.currentUserSubject.next(user);
            }

            return user;
          })
        );
  }
  /** 
   * User Signup
   * 
   */
  signUp( formData: RegisterForm ) {

    return this._http
                .post<any>( `${ base_url }/usuario`,formData ) 
                  .pipe(
                    map(user => {
                
                      // login successful if there's a jwt token in the response
                      if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('token', JSON.stringify(user.token));
                      }
                    })
                  );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');

    this.auth2.signOut().then( () => {
      console.log('User signed out.');
      // this._router.navigate(['/login']);
    });

    // notify
    this.currentUserSubject.next(null);
    
  }
}
