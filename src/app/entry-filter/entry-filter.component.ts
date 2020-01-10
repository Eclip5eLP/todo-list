import { Component, OnInit, Input, Output, AfterViewInit, ElementRef, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
import { Entries } from '../entries';
import { LoadListsService } from "../load-lists.service";
import { TodoListComponent } from "../todo-list/todo-list.component";

@Component({
  selector: 'app-entry-filter',
  templateUrl: './entry-filter.component.html',
  styleUrls: [ './entry-filter.component.css' ]
})
export class EntryFilterComponent implements OnInit {
  //lists$: Observable<Entries[]>;
  private searchTerms = new Subject<string>();
  @Input() lists$: Observable<Entries[]>;
  @Output() change = new EventEmitter();

  constructor(
  	private getListsService: LoadListsService,
  	private todoListComponent: TodoListComponent
  ) {}

  search(term: string): void {
    this.searchTerms.next(term);
    var inputValue = (<HTMLInputElement>document.getElementById("search-box")).value;
	if (inputValue == "") {
	  this.todoListComponent.showFiltered = false;
	  this.change.emit(this.lists$);
	} else {
	  this.todoListComponent.showFiltered = true;
	  this.change.emit(this.lists$);
	}
  }

  showInfo(entry: Entries): void {
	this.todoListComponent.dispInfo = entry;
  }

  ngOnInit(): void {
    this.lists$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.getListsService.searchEntry(term)),
    );
    this.todoListComponent.lists$ = this.lists$;
  }
}