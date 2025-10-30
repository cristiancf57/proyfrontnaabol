import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './dashboard/footer/footer.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { ListUsuariosComponent } from './dashboard/list-usuarios/list-usuarios.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { CardUsuarioComponent } from './dashboard/list-usuarios/card-usuario/card-usuario.component';
import { HttpClientModule } from '@angular/common/http';
import { PrincipalComponent } from './dashboard/principal/principal.component';
import { CalendarComponent } from './dashboard/principal/calendar/calendar.component';
import { GrafficChartComponent } from './dashboard/principal/graffic-chart/graffic-chart.component';
import { ListActivosComponent } from './dashboard/list-activos/list-activos.component';
import { ActivoChartComponent } from './dashboard/principal/activo-chart/activo-chart.component';
import { ListMantenimientoComponent } from './dashboard/principal/list-mantenimiento/list-mantenimiento.component';
import { FormsComponent } from './dashboard/forms/forms.component';
import { ListMantDetalleComponent } from './dashboard/list-mant-detalle/list-mant-detalle.component';
import { ListActividadComponent } from './dashboard/list-actividad/list-actividad.component';
import { DetalleActividadComponent } from './dashboard/list-actividad/detalle-actividad/detalle-actividad.component';
import { EditActividadComponent } from './dashboard/list-actividad/edit-actividad/edit-actividad.component';
import { FormActividadComponent } from './dashboard/forms/form-actividad/form-actividad.component';
import { BuscadorActivoComponent } from './dashboard/buscador-activo/buscador-activo.component';
import { DetalleActivoComponent } from './dashboard/list-activos/detalle-activo/detalle-activo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileSettingsComponent } from './dashboard/profile-settings/profile-settings.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    NavbarComponent,
    ListUsuariosComponent,
    LayoutComponent,
    LoginComponent,
    CardUsuarioComponent,
    PrincipalComponent,
    CalendarComponent,
    GrafficChartComponent,
    ListActivosComponent,
    ActivoChartComponent,
    ListMantenimientoComponent,
    FormsComponent,
    ListMantDetalleComponent,
    ListActividadComponent,
    DetalleActividadComponent,
    EditActividadComponent,
    FormActividadComponent,
    BuscadorActivoComponent,
    DetalleActivoComponent,
    ProfileSettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
