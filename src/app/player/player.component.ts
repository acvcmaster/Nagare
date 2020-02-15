import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Playlist } from './playlist/playlist.model';
import { PlaylistService } from './playlist/playlist.service';
import { Subscription } from 'rxjs';
import { Song } from './song/song.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  dblClickFlag: boolean;

  constructor(private playlistService: PlaylistService) { }

  @ViewChild('search', {static: false}) searchInput: ElementRef;
  @ViewChild('audio', {static: false}) audioElement: ElementRef;
  shuffle = false;
  playlists: Playlist[];
  subscriptions = new Subscription();
  currentPlaylist: Playlist;
  currentPlaylistUnshuffled: Playlist;
  currentSong: Song;
  currentPlayingSong: Song;
  currentSongIndex = 0;
  filteredPlaylist: Song[];
  searchTypeIndex = 0;
  searchTypes = ['Song', 'Artist', 'Album'];
  searchTypeColors = ['lime', 'orange', 'orangered'];
  searchTypeIcons = ['music_note', 'person', 'album'];
  playing = false;
  flippedFlag = false;

  ngOnInit() {
    this.subscriptions.add(this.playlistService.getPlaylists().subscribe(playlist => {
      if (playlist && playlist.length) {
        this.playlists = playlist;
        this.currentPlaylist = this.playlists[0];
        this.currentPlaylistUnshuffled = JSON.parse(JSON.stringify(this.currentPlaylist));
        this.currentSong = this.currentPlaylist.songs[this.currentSongIndex];
        this.getFilteredPlaylist();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.audioElement.nativeElement.onended = () => {
      this.changeSong();
    };
  }

  changeSong(previous?: boolean) {
    if (this.currentPlaylist && this.currentPlaylist.songs && this.currentPlaylist.songs.length) {
      this.currentSongIndex = (this.currentSongIndex + (previous ? -1 : 1)) % this.currentPlaylist.songs.length;
      this.currentSongIndex = this.currentSongIndex >= 0 ? this.currentSongIndex :
        (this.currentPlaylist.songs.length + this.currentSongIndex);
      this.selectSong(this.currentPlaylist.songs[this.currentSongIndex]);
      this.play(true);
    }
  }

  selectSong(song: Song) {
    this.flippedFlag = false;
    this.currentSong = song;
    this.currentSongIndex = this.currentPlaylist.songs.findIndex(item => item === song);
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
    this.searchInput.nativeElement.value = '';
    this.getFilteredPlaylist();
  }

  searchAlbum(album: string) {
    this.searchTypeIndex = this.searchTypes.findIndex(item => item === 'Album');
    this.searchInput.nativeElement.value = album;
    this.getFilteredPlaylist(album);
  }

  selectFirstSong() {
    if (this.filteredPlaylist && this.filteredPlaylist.length) {
      this.currentSong = this.filteredPlaylist[0];
      this.currentSongIndex = this.currentPlaylist.songs.findIndex(item => item === this.currentSong);
      this.play(true);
      this.searchInput.nativeElement.value = '';
      this.getFilteredPlaylist();
    }
  }

  play(reset?: boolean) {
    if (reset) {
      this.playing = false;
      this.audioElement.nativeElement.pause();
      this.currentPlayingSong = null;
      this.play();
    } else {
      if (this.playing) {
        this.audioElement.nativeElement.pause();
      } else {
        if (!this.currentPlayingSong) {
          this.currentPlayingSong = this.currentSong;
          this.audioElement.nativeElement.src = this.currentPlayingSong.url;
        }
        this.audioElement.nativeElement.play();
      }
      this.playing = !this.playing;
    }
  }

  songClick(song: Song) {
    this.selectSong(song);
    if (this.dblClickFlag) {
      this.dblClickFlag = false;
      this.play(true);
    } else {
      this.dblClickFlag = true;
      setTimeout(() => {
        if (this.dblClickFlag) {
          this.dblClickFlag = false;
        }
      }, 333);
    }
  }

  songPlaying(song: Song): boolean {
    return this.playing && song && this.currentPlayingSong ? song.name === this.currentPlayingSong.name : false;
  }

  toggleShuffle(filter: string) {
    this.shuffle = !this.shuffle;
    if (this.shuffle) {
      if (this.currentPlaylist && this.currentPlaylist.songs) {
        const result = [];
        this.currentPlaylist.songs.forEach(song => {
          result.push({ r: Math.random(), song});
        });
        this.currentPlaylist.songs = result.sort((a, b) => a.r - b.r).map(item => item.song);
        if (this.currentPlayingSong) {
          this.currentPlaylist.songs = this.currentPlaylist.songs.filter(song => song.name !== this.currentPlayingSong.name);
          this.currentPlaylist.songs.unshift(this.currentPlayingSong);
        }
      }
    } else {
      this.currentPlaylist = JSON.parse(JSON.stringify(this.currentPlaylistUnshuffled));
    }
    this.getFilteredPlaylist(filter);
  }

  flipLyrics() {
    if (this.currentSong && this.currentSong.lyrics) {
      this.flippedFlag = !this.flippedFlag;
    }
  }
}
