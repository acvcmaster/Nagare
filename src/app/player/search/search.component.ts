import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SearchService } from './search.service';
import { QueueService } from '../queue/queue.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  constructor(
    public readonly searchService: SearchService,
    private readonly queueService: QueueService
  ) { }

  @ViewChild('search', { static: false }) searchElement: ElementRef;

  ngAfterViewInit() {
    this.searchService.searchElement = this.searchElement;
  }

  ngOnDestroy() {
    this.searchService.searchElement = null;
  }

  next(value: string) {
    this.searchService.next(value);
  }

  filter(value: string) {
    this.searchService.filter(value);
  }
  first() {

  }
}
