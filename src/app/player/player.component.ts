import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Playlist } from './playlist/playlist.model';
import { PlaylistService } from './playlist/playlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  dblClickFlag: boolean;

  constructor(private playlistService: PlaylistService) { }

  @ViewChild('search', {static: false}) searchInput: ElementRef;
  playlists: Playlist[];
  subscriptions = new Subscription();
  flippedFlag = false;

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
