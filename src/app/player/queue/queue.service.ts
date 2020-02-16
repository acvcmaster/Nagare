import { PlaylistService } from '../playlist/playlist.service';
import { Injectable } from '@angular/core';
import { Playlist } from '../playlist/playlist.model';
import { Song } from '../song/song.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    constructor(
        private readonly playlistService: PlaylistService
    ) { }

    // tslint:disable: variable-name
    // playlist
    private playlists: Playlist[] = [];
    private playlistIndex = 0;
    public get currentPlaylist(): Playlist {
        if (this.playlists && this.playlists.length) {
            return this.playlists[this.playlistIndex];
        }
        return null;
    }

    private _shuffled = false;
    public get shuffled() { return this._shuffled; }
    public set shuffled(s: boolean) { this._shuffled = s; this.sortPlaylists(); }

    // songs
    _songIndex = 0;
    public get songIndex() { return this._songIndex; }
    public set songIndex(value: number) { this._songIndex = value; this.emitSong(); }
    public songSubject = new Subject<Song>();
    public get currentSong(): Song {
        if (this.currentPlaylist && this.currentPlaylist.songs && this.currentPlaylist.songs.length) {
            return this.currentPlaylist.songs[this.songIndex];
        }
        return null;
    }
    _playing = false;
    public playSubject = new Subject<boolean>();
    public get playing() { return this._playing; }
    public set playing(value: boolean) { this._playing = value; this.emitPlaying(); }

    public init(): Subject<boolean> {
        const result = new Subject<boolean>();
        const subscription = this.playlistService.getPlaylists().subscribe(playlists => {
            if (playlists && playlists.length) {
                this.playlists = playlists;
                this.playlistIndex = 0;
                this.acquireIndexes();
                this.sortPlaylists();
                result.next(true);
            }
            result.next(false);
            subscription.unsubscribe();
        });
        return result;
    }

    private acquireIndexes(rng?: boolean) {
        this.playlists.forEach(playlist => {
            const length = playlist.songs.length;
            for (let i = 0; i < length; i++) {
                if (rng) {
                    if (this.currentSong && this.isPlaying(this.currentSong) && playlist.songs[i].name === this.currentSong.name) {
                        playlist.songs[i].rng_index = -1;
                    } else {
                        playlist.songs[i].rng_index = Math.random();
                    }
                } else {
                    playlist.songs[i].playlist_index = i;
                }
            }
        });
    }

    private sortPlaylists() {
        const currentSong: any = {};
        Object.assign(currentSong, this.currentSong);

        if (this.shuffled) {
            this.acquireIndexes(true);
        }
        this.playlists.forEach(playlist => {
            playlist.songs.sort((a, b) => this.shuffled ? a.rng_index - b.rng_index : a.playlist_index - b.playlist_index);
        });
        this._songIndex = this.currentPlaylist.songs.findIndex(song => song.name === currentSong.name);
    }

    public changeSong(song: Song) {
        if (this.currentPlaylist && this.currentPlaylist.songs) {
            this.songIndex = this.currentPlaylist.songs.findIndex(s => s.name === song.name);
        }
    }

    public isPlaying(song: Song): boolean {
        return this.playing && this.currentSong.name === song.name;
    }

    private emitSong() {
        this.songSubject.next(this.currentSong);
    }

    private emitPlaying() {
        this.playSubject.next(this.playing);
    }

    public previousSong() {
        this.songIndex = (this.songIndex - 1) % this.currentPlaylist.songs.length;
        this.songIndex = this.songIndex >= 0 ? this.songIndex :
          (this.currentPlaylist.songs.length + this.songIndex);
    }

    public nextSong() {
        this.songIndex = (this.songIndex + 1) % this.currentPlaylist.songs.length;
    }
}
