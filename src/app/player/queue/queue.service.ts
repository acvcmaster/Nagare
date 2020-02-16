import { PlaylistService } from '../playlist/playlist.service';
import { Injectable } from '@angular/core';
import { Playlist } from '../playlist/playlist.model';
import { Song } from '../song/song.model';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    constructor(private readonly playlistService: PlaylistService) { }

    // playlist
    public fiterType: 'Song' | 'Artist' | 'Album' = 'Song';
    playlists: Playlist[] = [];
    playlistIndex = 0;
    public get currentPlaylist(): Playlist {
        if (this.playlists && this.playlists.length) {
            return this.playlists[this.playlistIndex];
        }
        return null;
    }

    // tslint:disable-next-line: variable-name
    _shuffled = false;
    public get shuffled() { return this._shuffled; }
    public set shuffled(s: boolean) { this._shuffled = s; this.sortPlaylists(); }

    // songs
    songIndex = 0;
    public get currentSong(): Song {
        if (this.currentPlaylist && this.currentPlaylist.songs && this.currentPlaylist.songs.length) {
            return this.currentPlaylist.songs[this.songIndex];
        }
        return null;
    }

    public init() {
        this.playlistService.getPlaylists().subscribe(playlists => {
            if (playlists && playlists.length) {
                this.playlists = playlists;
                this.playlistIndex = 0;
                this.acquireIndexes();
                this.sortPlaylists();
            }
        });
    }

    acquireIndexes(rng?: boolean) {
        this.playlists.forEach(playlist => {
            const length = playlist.songs.length;
            for (let i = 0; i < length; i++) {
                if (rng) {
                    playlist.songs[i].rng_index = Math.random();
                } else {
                    playlist.songs[i].playlist_index = i;
                }
            }
        });
    }

    sortPlaylists() {
        if (this.shuffled) {
            this.acquireIndexes(true);
        }
        this.playlists.forEach(playlist => {
            playlist.songs.sort((a, b) => this.shuffled ? a.rng_index - b.rng_index : a.playlist_index - b.playlist_index);
        });
    }

    selectFirst() {
        throw new Error('Method not implemented.');
    }
}
