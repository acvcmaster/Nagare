import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SearchService } from './search.service';
import { QueueService } from '../queue/queue.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  constructor(
    public readonly searchService: SearchService,
    private readonly queueService: QueueService
  ) { }

  next(value: string) {
    this.searchService.next(value);
  }

  filter(value: string) {
    this.searchService.filter(value);
  }
  first() {

  }
}
