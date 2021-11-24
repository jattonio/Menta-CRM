import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService } from '../service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;

  public auth2;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthenticationService,
    private _ngZone: NgZone
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this._authService.login( this.loginForm.value )
        .subscribe( resp => {
          console.log( 'Login exitoso' );
          console.log( resp );
          // Login
          this.loading = true;

          if ( this.loginForm.get('remember').value ) {
            localStorage.setItem( 'email', this.loginForm.get('email').value );
          } else {
            localStorage.removeItem( 'email' );
          }

          // redirect to home page
          setTimeout(() => {
            this._ngZone.run( () => this._router.navigateByUrl('/') );
          }, 2000);

        }, ( err ) => {
          Swal.fire( 'Error', err.error.msg, 'error' );
        } );

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    this.renderButton();

    this.loginForm = this._formBuilder.group({
      email: [ localStorage.getItem('email') || '' , [Validators.required, Validators.email]],
      password: ['1234', Validators.required],
      remember: [true]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

   }


  // onSuccess( googleUser ) {
  //   console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    
  //   const id_token = googleUser.getAuthResponse().id_token;
  //   console.log( id_token );
  // }

  // onFailure(error) {
  //   console.log(error);
  // }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      // 'onsuccess': this.onSuccess,
      // 'onfailure': this.onFailure
    });

    this.startApp();
  }

   async startApp () {
    // gapi.load('auth2', () => {
    //   // Retrieve the singleton for the GoogleAuth library and set up the client.
    //   this.auth2 = gapi.auth2.init({
    //     client_id: '934127508309-lpeq8j27mdmkjcikjpupse410l3caloh.apps.googleusercontent.com',
    //     cookiepolicy: 'single_host_origin',
    //   });
    // });
    await this._authService.googleInit();
    this.auth2 = this._authService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        ( googleUser ) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this._authService.loginGoogle( id_token )
            .subscribe( resp => {
              // this._router.navigateByUrl('/');
              this._ngZone.run( () => this._router.navigateByUrl('/').then() );
            } );

          // navegar a página principal

        }, ( error ) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
