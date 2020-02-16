import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Playlist } from './playlist/playlist.model';
import { PlaylistService } from './playlist/playlist.service';
import { Subscription } from 'rxjs';
import { Song } from './song/song.model';
import { QueueService } from './queue/queue.service';
import { SearchService } from './search/search.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  dblClickFlag: boolean;

  constructor(
    private readonly queueService: QueueService,
    private readonly searchService: SearchService
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
  get filteredPlaylist(): Song[] {
    return this.searchService.filteredPlaylist;
  }
  get playing() {
    return this.queueService.playing;
  }

  ngOnInit() {
    this.subscriptions.add(this.queueService.init().subscribe(success => success ? this.searchService.filter('') : null));
    this.subscriptions.add(this.queueService.songSubject.subscribe(song => this.selectedSong = song));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  isPlaying(song: Song): boolean {
    return this.queueService.isPlaying(song);
  }

  isSelected(song: Song): boolean {
    if (this.selectedSong) {
      return this.selectedSong.name === song.name;
    }
    return false;
  }

  selectSong(song: Song) {
    this.flippedFlag = false;
    this.selectedSong = song;
    if (this.dblClickFlag) {
      this.dblClickFlag = false;
      this.queueService.changeSong(song);
    } else {
      this.dblClickFlag = true;
      setTimeout(() => {
        if (this.dblClickFlag) {
          this.dblClickFlag = false;
        }
      }, 333);
    }
  }

  previousSong() {
    this.queueService.previousSong();
  }

  nextSong() {
    this.queueService.nextSong();
  }

  togglePlay() {
    this.queueService.playing = !this.queueService.playing;
  }

  toggleShuffle() {
    this.queueService.shuffled = !this.queueService.shuffled;
  }
}
