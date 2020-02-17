import { Injectable, ElementRef } from '@angular/core';
import { QueueService } from '../queue/queue.service';
import { Song } from '../song/song.model';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(private readonly queueService: QueueService) { }

    private searchIndex = 0;
    // tslint:disable: variable-name
    private _searchTypes = ['Song', 'Artist', 'Album'];
    private _searchColors = ['limegreen', 'orange', 'orangered'];
    private _searchIcons = ['music_note', 'person', 'album'];
    public filteredPlaylist: Song[] = [];
    public searchElement: ElementRef;

    public next(value: string) {
        const length = this._searchTypes.length;
        this.searchIndex = (this.searchIndex + 1) % length;
        this.filter(value);
    }

    public get searchType() {
        return this._searchTypes[this.searchIndex];
    }
    public get searchColor() {
        return this._searchColors[this.searchIndex];
    }
    public get searchIcon() {
        return this._searchIcons[this.searchIndex];
    }

    public filter(value: string, type?: 'Song' | 'Artist' | 'Album') {
        if (type) {
            this.searchIndex = this._searchTypes.findIndex(t => t === type);
            if (this.searchElement) { this.searchElement.nativeElement.value = value; }
        }

        if (!value) {
            this.filteredPlaylist = this.queueService.currentPlaylist.songs || [];
        } else {
            this.filteredPlaylist = this.queueService.currentPlaylist.songs.filter(song => {
                switch (this.searchType) {
                    case 'Song':
                        return (song.name ? song.name : '').toLowerCase().indexOf(value.toLowerCase()) !== -1;
                    case 'Artist':
                        return (song.artist ? song.artist : '').toLowerCase().indexOf(value.toLowerCase()) !== -1;
                    case 'Album':
                        return (song.album ? song.album : '').toLowerCase().indexOf(value.toLowerCase()) !== -1;
                }
            });
        }
    }
}
