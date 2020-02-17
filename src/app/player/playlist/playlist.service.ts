import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Playlist } from './playlist.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  public getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${environment.apiUrl}/GetAllAmplitudeJSPlaylist`).pipe(map(playlists => {
      const result = playlists;
      result.forEach(playlist => {
        playlist.songs.forEach(song => {
          if (song.lyrics) {
            song.lyrics = song.lyrics.split('\r').join('\n');
          }
        });
      });
      return result;
    }));
  }
}
