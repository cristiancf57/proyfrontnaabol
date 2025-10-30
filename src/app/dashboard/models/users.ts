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
  name: string;
  username: string;
  email: string;
  email_verified_at: Date ;
  created_at: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  user: IUser;
  token: string;
  token_type: string;
  message?: string;
}