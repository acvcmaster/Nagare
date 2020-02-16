import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor() { }

    private searchIndex = 0;
    // tslint:disable: variable-name
    private _searchTypes = ['Song', 'Artist', 'Album'];
    private _searchColors = ['green', 'orange', 'orangered'];
    private _searchIcons = ['error', 'error', 'album'];

    public next() {
        const length = this._searchTypes.length;
        this.searchIndex = (this.searchIndex + 1) % length;
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
}
