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

  @ViewChild('search', {static: false}) search: ElementRef;
  @ViewChild('audio', {static: false}) audio: ElementRef;
  shuffle = true;
  playlists: Playlist[];
  subscriptions = new Subscription();
  currentPlaylist: Playlist;
  currentSong: Song;
  currentPlayingSong: Song;
  currentSongIndex = 0;
  filteredPlaylist: Song[];
  searchTypeIndex = 0;
  searchTypes = ['Song', 'Artist', 'Album'];
  searchTypeColors = ['lime', 'orange', 'orangered'];
  searchTypeIcons = ['music_note', 'person', 'album'];
  playing = false;

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

  changeSong(previous?: boolean) {
    if (this.currentPlaylist && this.currentPlaylist.songs && this.currentPlaylist.songs.length) {
      this.currentSongIndex = (this.currentSongIndex + (previous ? -1 : 1)) % this.currentPlaylist.songs.length;
      this.currentSongIndex = this.currentSongIndex >= 0 ? this.currentSongIndex :
        (this.currentPlaylist.songs.length + this.currentSongIndex);
      this.selectSong(this.currentPlaylist.songs[this.currentSongIndex], true);
    }
  }

  selectSong(song: Song, setPlaying?: boolean) {
    this.currentSong = song;
    this.currentSongIndex = this.currentPlaylist.songs.findIndex(item => item === song);
    if (setPlaying) {
      this.playing = false;
      this.audio.nativeElement.pause();
      this.currentPlayingSong = null;
      this.play();
    }
  }

  getFilteredPlaylist(filter?: string) {
    if (!filter) {
      this.filteredPlaylist = this.currentPlaylist.songs;
    } else {
      switch (this.searchTypes[this.searchTypeIndex]) {
        case 'Artist':
          this.filteredPlaylist = this.currentPlaylist.songs.filter(song =>
            (song.artist ? song.artist : '').toLowerCase().indexOf(filter.toLowerCase()) !== -1);
          break;
        case 'Song':
          this.filteredPlaylist = this.currentPlaylist.songs.filter(song =>
            (song.name ? song.name : '').toLowerCase().indexOf(filter.toLowerCase()) !== -1);
          break;
        case 'Album':
          this.filteredPlaylist = this.currentPlaylist.songs.filter(song =>
            (song.album ? song.album : '').toLowerCase().indexOf(filter.toLowerCase()) !== -1);
          break;
      }
    }
  }

  nextSearchType() {
    this.searchTypeIndex = (this.searchTypeIndex + 1) % this.searchTypes.length;
    this.search.nativeElement.value = '';
    this.getFilteredPlaylist();
  }

  searchAlbum(album: string) {
    this.searchTypeIndex = this.searchTypes.findIndex(item => item === 'Album');
    this.search.nativeElement.value = album;
    this.getFilteredPlaylist(album);
  }

  selectFirstSong() {
    if (this.filteredPlaylist && this.filteredPlaylist.length) {
      this.currentSong = this.filteredPlaylist[0];
      this.currentSongIndex = this.currentPlaylist.songs.findIndex(item => item === this.currentSong);
      this.search.nativeElement.value = '';
      this.getFilteredPlaylist();
    }
  }

  play() {
    if (this.playing) {
      this.audio.nativeElement.pause();
    } else {
      if (!this.currentPlayingSong) {
        this.currentPlayingSong = this.currentSong;
        this.audio.nativeElement.src = this.currentPlayingSong.url;
      }
      this.audio.nativeElement.play();
    }
    this.playing = !this.playing;
  }
}
