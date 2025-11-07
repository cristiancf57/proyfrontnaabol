import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PrincipalComponent } from './dashboard/principal/principal.component';
import { ListUsuariosComponent } from './dashboard/list-usuarios/list-usuarios.component';
import { ListActivosComponent } from './dashboard/list-activos/list-activos.component';
import { FormsComponent } from './dashboard/forms/forms.component';
import { FormActivoComponent } from './dashboard/forms/form-activo/form-activo.component';
import { ListMantDetalleComponent } from './dashboard/list-mant-detalle/list-mant-detalle.component';
import { ListActividadComponent } from './dashboard/list-actividad/list-actividad.component';
import { DetalleActividadComponent } from './dashboard/list-actividad/detalle-actividad/detalle-actividad.component';
import { FormActividadComponent } from './dashboard/forms/form-actividad/form-actividad.component';
import { BuscadorActivoComponent } from './dashboard/buscador-activo/buscador-activo.component';
import { DetalleActivoComponent } from './dashboard/list-activos/detalle-activo/detalle-activo.component';
import { ProfileSettingsComponent } from './dashboard/profile-settings/profile-settings.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { EditActivoComponent } from './dashboard/list-activos/edit-activo/edit-activo.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component:LoginComponent},
  {path: 'layout', component:LayoutComponent},
  {path: 'register', component:FormsComponent},
  {path: 'dashboard', component:DashboardComponent, 
    children:[
      {path: 'admins', component:AdminComponent},
      {path: 'principal', component:PrincipalComponent},
      {path: 'usuario', component:ListUsuariosComponent},
      {path: 'perfil/:id', component:ProfileSettingsComponent},
      {path: 'activo', component:ListActivosComponent},
      {path: 'activos/detalle/:id', component:DetalleActivoComponent},
      {path: 'activos/edit/:id', component:EditActivoComponent},
      {path: 'mantenimiento', component:ListMantDetalleComponent},
      {path: 'actividades', component:ListActividadComponent},
      {path: 'actividades/detalle/:id', component:DetalleActividadComponent},
      {path: 'form-activo', component:FormActivoComponent},
      {path: 'form-actividad/:id', component:FormActividadComponent},
      {path: 'buscar-activo', component:BuscadorActivoComponent},
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
