import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DeckService } from './services/deck.service';
import { HttpClientModule } from '@angular/common/http';
import { PivotComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { CommonServicesModule } from './services/common/common.module';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    PagesModule,
    PivotComponentsModule,
    CommonServicesModule,
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeckService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}
