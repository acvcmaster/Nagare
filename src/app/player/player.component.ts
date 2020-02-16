import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Playlist } from './playlist/playlist.model';
import { PlaylistService } from './playlist/playlist.service';
import { Subscription } from 'rxjs';
import { Song } from './song/song.model';
import { QueueService } from './queue/queue.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  dblClickFlag: boolean;

  constructor(
    private playlistService: PlaylistService,
    private readonly queueService: QueueService
  ) { }

  playlists: Playlist[];
  subscriptions = new Subscription();
  flippedFlag = false;
  selectedSong: Song;
  get currentSong(): Song {
    return this.queueService.currentSong;
  }
  get currentPlaylist(): Playlist {
    return this.queueService.currentPlaylist;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
