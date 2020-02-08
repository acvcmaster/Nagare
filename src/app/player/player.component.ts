import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Playlist } from './playlist/playlist.model';
import { PlaylistService } from './playlist/playlist.service';
import { Subscription } from 'rxjs';
import { Song } from './song/song.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  constructor(private playlistService: PlaylistService) { }

  @ViewChild('albumCover', {static: false}) albumCover: ElementRef;
  shuffle = true;
  playlists: Playlist[];
  subscriptions = new Subscription();
  currentPlaylist: Playlist;
  currentSong: Song;
  currentSongIndex = 0;

  ngOnInit() {
    this.playlistService.getPlaylists().subscribe(playlist => {
      if (playlist && playlist.length) {
        this.playlists = playlist;
        this.currentPlaylist = this.playlists[0];
        this.currentSong = this.currentPlaylist.songs[this.currentSongIndex];
      }
    });
  }

  playing(): boolean {
    return false;
  }

  nextSong() {
    if (this.currentPlaylist && this.currentPlaylist.songs && this.currentPlaylist.songs.length) {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.currentPlaylist.songs.length;
      this.currentSong = this.currentPlaylist.songs[this.currentSongIndex];
    }
  }

  previousSong() {
    if (this.currentPlaylist && this.currentPlaylist.songs && this.currentPlaylist.songs.length) {
      // implement
      this.currentSong = this.currentPlaylist.songs[this.currentSongIndex];
    }
  }
}
