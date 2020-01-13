import { Component, OnInit, Input, Output, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
import { Entries } from '../entries';
import { LoadListsService } from "../load-lists.service";

@Component({
  selector: 'app-entry-filter',
  templateUrl: './entry-filter.component.html',
  styleUrls: [ './entry-filter.component.css' ]
})
export class EntryFilterComponent implements OnInit {
  lists$: Observable<Entries[]>;
  private searchTerms = new Subject<string>();

  constructor(
  	private getListsService: LoadListsService
  ) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.lists$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.getListsService.searchEntry(term)),
    );
  }
}