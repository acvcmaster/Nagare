import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { QueueService } from '../player/queue/queue.service';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    constructor(private readonly queueService: QueueService) { }
    // tslint:disable: variable-name
    private _volume = 1;
    private _audioElement: ElementRef;
    updateSubject = new Subject<unknown>();
    public volumeSubject = new Subject<number>();
    public get volume() { return this._volume; }
    public set volume(value: number) {
        this._volume = value > 1 ? 1 : (value < 0 ? 0 : value);
        this.volumeSubject.next(this.volume);
    }

    public get audioElement(): ElementRef {
        return this._audioElement;
    }
    public set audioElement(value: ElementRef) {
        this._audioElement = value;
        if (this._audioElement) {
            this.audioElement.nativeElement.onended = () => {
                this.queueService.nextSong();
            };
            this.audioElement.nativeElement.ontimeupdate = () => {
                this.updateSubject.next();
            };
        }
    }

    public get progress(): number {
        console.log(this.audioElement.nativeElement.currentTime);
        return !this.audioElement.nativeElement.src ? 0 :
            this.audioElement.nativeElement.currentTime / this.audioElement.nativeElement.duration;
    }
    public set progress(value: number) {
        this.audioElement.nativeElement.currentTime = value * this.audioElement.nativeElement.duration;
    }
}
