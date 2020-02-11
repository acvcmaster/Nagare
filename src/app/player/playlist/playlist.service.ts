import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Playlist } from './playlist.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  public getPlaylists(): Observable<Playlist[]> {
    return forkJoin(
      [
        this.http.get<Playlist>('http://localhost:22781/Playlist/GetAmplitudeJSPlaylist?id=1'),
        this.http.get<Playlist>('http://localhost:22781/Playlist/GetAmplitudeJSPlaylist?id=3'),
        this.http.get<Playlist>('http://localhost:22781/Playlist/GetAmplitudeJSPlaylist?id=4')
      ]
    );
  }
}
