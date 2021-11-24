import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { CoreConfigService } from '@core/services/config.service';
import { AuthenticationService } from '../service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterComponent implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: FormGroup;
  public formSubmitted = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(  private _coreConfigService: CoreConfigService, 
                private _formBuilder: FormBuilder,
                private _authService: AuthenticationService,
                private _router: Router,
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
    // console.log( this.registerForm.controls );
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.formSubmitted = true;
    // console.log( this.registerForm.controls );

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      // console.log('Formulario incorrecto');
      return;
    }

    this._authService.signUp( this.registerForm.value )
                      .subscribe( resp => {
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
    this.registerForm = this._formBuilder.group({
      nombre: [ '', Validators.required ],
      email: [ '', [ Validators.required, Validators.email ]],
      password: [ '', Validators.required ],
      password2: [ '', Validators.required ],
      policy: [ false , Validators.requiredTrue ]
    }, {
      validators: this.passwordsCorrect('password', 'password2')
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
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

  /**
   * Accept Policy checbox
   */
  acceptPolicy(){
    return !this.registerForm.get('policy').value && this.formSubmitted;
  }

  passwordsNoValid(  ){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * Validación de Passwords Iguales
   */
  passwordsCorrect( pass1: string, pass2: string ){
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors( null );
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      } 

    }
  }
}
