export interface IUser {
    id: number
    nombre: string 
    apellido: string 
    email: string 
    email_verified_at: Date 
    telefono: string 
    perfil: string 
    username: string 
    password: string 
}

export interface IUserPost {
    nombre: string 
    apellido: string 
    email: string 
    telefono: string 
    username: string 
    password: string 
}

export interface IUser {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  email_verified_at: Date ;
  created_at: string;
  cargo:string
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  user: IUser;
  token: string;
  token_type: string;
  message?: string;
}

export interface IRole {
  id: number;
  name: string;
  uard_name: string
  permissions?: IPermission[];
}

export interface IPermission {
  id: number;
  name: string;
  guard_name: string
}

export interface IRoles {
  id: number
  name: string
  guard_name: string
}

export interface IPermissions {
  id: number
  name: string
  guard_name: string
}
