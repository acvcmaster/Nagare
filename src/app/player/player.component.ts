import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Playlist } from './playlist/playlist.model';
import { PlaylistService } from './playlist/playlist.service';
import { Subscription } from 'rxjs';
import { Song } from './song/song.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {

  constructor(private playlistService: PlaylistService) { }

  @ViewChild('albumCover', {static: false}) albumCover: ElementRef;
  shuffle = true;
  playlists: Playlist[];
  subscriptions = new Subscription();
  currentPlaylist: Playlist;
  currentSong: Song;
  currentSongIndex = 0;
  filteredPlaylist: Song[];
  searchTypeIndex = 0;
  searchTypes = ['Song', 'Artist'];
  searchTypeColors = ['lime', 'orange'];

  ngOnInit() {
    this.subscriptions.add(this.playlistService.getPlaylists().subscribe(playlist => {
      if (playlist && playlist.length) {
        this.playlists = playlist;
        this.currentPlaylist = this.playlists[0];
        this.currentSong = this.currentPlaylist.songs[this.currentSongIndex];
        this.getFilteredPlaylist();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  playing(): boolean {
    return false;
  }

  changeSong(previous?: boolean) {
    if (this.currentPlaylist && this.currentPlaylist.songs && this.currentPlaylist.songs.length) {
      this.currentSongIndex = (this.currentSongIndex + (previous ? -1 : 1)) % this.currentPlaylist.songs.length;
      this.currentSongIndex = this.currentSongIndex >= 0 ? this.currentSongIndex :
        (this.currentPlaylist.songs.length + this.currentSongIndex);
      this.currentSong = this.currentPlaylist.songs[this.currentSongIndex];
    }
  }

  selectSong(song: Song) {
    this.currentSong = song;
  }

  getFilteredPlaylist(filter?: string) {
    if (!filter) {
      this.filteredPlaylist = this.currentPlaylist.songs;
    } else {
      switch (this.searchTypes[this.searchTypeIndex]) {
        case 'Artist':
          this.filteredPlaylist = this.currentPlaylist.songs.filter(song =>
            song.artist.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
          break;
        case 'Song':
          this.filteredPlaylist = this.currentPlaylist.songs.filter(song =>
            song.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
          break;
      }
    }
  }

  nextSearchType(filter?: string) {
    this.searchTypeIndex = (this.searchTypeIndex + 1) % this.searchTypes.length;
    this.getFilteredPlaylist(filter);
  }
}
