import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { FormActivoComponent } from './dashboard/activos/form-activo/form-activo.component';
import { ActivoChartComponent } from './dashboard/principal/activo-chart/activo-chart.component';

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
    FormActivoComponent,
    ActivoChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
