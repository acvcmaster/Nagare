import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Playlist } from './playlist.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  public getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${environment.apiUrl}/GetAllAmplitudeJSPlaylist`);
  }
}
