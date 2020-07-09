import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule} from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NbThemeModule,
         NbLayoutModule,
         NbSearchModule,
         NbButtonModule,
         NbSidebarModule,
         NbIconModule,
         NbMenuModule,
         NbCardModule,
         NbTooltipModule,
         NbSelectModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { DeveloperComponent } from './developer/developer.component';
import { AboutComponent } from './about/about.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DeveloperComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgProgressModule.withConfig({
      spinner: false,
      meteor: true
    }),
    NgProgressHttpModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbSearchModule,
    NbButtonModule,
    BrowserModule,
    FormsModule,
    NbCardModule,
    NbTooltipModule,
    NbSelectModule,
    NbSidebarModule.forRoot(),
    NbSidebarModule,
    NbMenuModule.forRoot(),
    NbEvaIconsModule,
    NbIconModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    ServiceWorkerModule.register('/pwabuilder-sw.js', { enabled: environment.production })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
