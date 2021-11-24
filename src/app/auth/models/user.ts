import { Role } from './role';

export class User {

    constructor (
      public email: string,
      public nombre: string,
      public uid?: string,
      public apellido?: string,
      public password?: string,
      public avatar?: string,
      public role?: Role,
      public google?: boolean,
      public token?: string,
    ) {}
}
