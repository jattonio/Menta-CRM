import { environment } from '../../../environments/environment';

import { Role } from './role';

export class User {
  public email: string;
  public nombre?: string;
  public id?: number;
  public uid?: string;
  public password?: string;
  public firstName?: string;
  public lastName?: string;
  public google?: boolean;
  public avatar?: string;
  public role?: Role;
  public token?: string; 

    constructor ( 
      email='',
      nombre='',
      id=0,
      uid='',
      password='',
      firstName='',
      lastName='',
      google=false,
      avatar='',
      role='',
      token='' 
      ){

    }

    public get avatarUrl(){

      // http://localhost:3005/api/upload/usuarios/e4ed32d6-d8c8-4ea6-ac3b-caf8e5a26b7c.png
      if ( this.avatar ) {
        if ( this.avatar.includes("https") ) {
          return this.avatar;
        }
        return `${ environment.base_url }/upload/usuarios/${ this.avatar }`;
      }else{
        return `${ environment.base_url }/upload/usuarios/no-image.png`;
      }
    }
}
