import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SearchService } from './search.service';
import { QueueService } from '../queue/queue.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    public readonly searchService: SearchService,
    private readonly queueService: QueueService
  ) { }
  @ViewChild('search', { static: false }) searchInput: ElementRef;

  ngOnInit() {
  }

  next() {
    this.searchService.next();
  }

  first() {
    this.queueService.selectFirst();
  }
}
