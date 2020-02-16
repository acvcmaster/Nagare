import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { QueueService } from '../player/queue/queue.service';
import { AudioService } from './audio.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private readonly queueService: QueueService,
    private readonly audioService: AudioService
    ) { }

  @ViewChild('audio', { static: false }) audioElement: ElementRef;

  ngOnInit() {
    this.queueService.playSubject.subscribe(playing => {
      if (playing) {
        if (this.audioElement.nativeElement.src === '') {
          this.queueService.songIndex = 0;
        } else {
          this.audioElement.nativeElement.play();
        }
      } else {
        this.audioElement.nativeElement.pause();
      }
    });

    this.queueService.songSubject.subscribe(song => {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.src = '';
      if (song) {
        this.audioElement.nativeElement.src = song.url;
        this.audioElement.nativeElement.play();
      }
      this.queueService.playing = true;
    });

    this.audioService.volumeSubject.subscribe(volume => {
      this.audioElement.nativeElement.volume = volume;
    });
  }

  ngAfterViewInit() {
    this.audioService.audioElement = this.audioElement;
  }

  ngOnDestroy() {
    this.audioService.audioElement = null;
  }
}
