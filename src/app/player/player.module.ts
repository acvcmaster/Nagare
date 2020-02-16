import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlayerComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    FormsModule
  ]
})
export class PlayerModule { }
