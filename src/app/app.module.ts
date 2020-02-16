import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerModule } from './player/player.module';
import { HttpClientModule } from '@angular/common/http';
import { AudioComponent } from './audio/audio.component';

@NgModule({
  declarations: [
    AppComponent,
    AudioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PlayerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
