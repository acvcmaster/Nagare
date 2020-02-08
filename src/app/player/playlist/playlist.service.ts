import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Playlist } from './playlist.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  public getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>('assets/playlist.mock.json');
  }
}
