import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QueueService } from './player/queue/queue.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private readonly queueService: QueueService) { }

  title = 'Nagare';
  @ViewChild('audio', {static: false}) audioElement: ElementRef;

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
  }
}
