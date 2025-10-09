import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PrincipalComponent } from './dashboard/principal/principal.component';
import { CardUsuarioComponent } from './dashboard/list-usuarios/card-usuario/card-usuario.component';
import { ListUsuariosComponent } from './dashboard/list-usuarios/list-usuarios.component';
import { ListActivosComponent } from './dashboard/activos/list-activos/list-activos.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component:LoginComponent},
  {path: 'layout', component:LayoutComponent},
  {path: 'dashboard', component:DashboardComponent,
    children:[
      {path: 'principal', component:PrincipalComponent},
      {path: 'usuario', component:ListUsuariosComponent},
      {path: 'activo', component:ListActivosComponent},
      {path: '', redirectTo: 'principal', pathMatch: 'full'} //default
    ]
  },
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
