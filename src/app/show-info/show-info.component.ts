import { Component, OnInit, Input } from '@angular/core';
import { Entries } from "../entries";
import { TodoListComponent } from "../todo-list/todo-list.component";
import { DatePipe } from '@angular/common';
import { LoadListsService } from "../load-lists.service";

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';

@Component({
  selector: 'app-show-info',
  templateUrl: './show-info.component.html',
  styleUrls: ['./show-info.component.css'],
  providers: [
  	{provide: DateAdapter, useClass: AppDateAdapter},
  	{provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ShowInfoComponent implements OnInit {
  @Input() dispInfo: Entries;

  constructor(private listsService: LoadListsService) { }

  save(date: string): void {
  	if (!date) { console.log("Cannot Save invalid date"); return; }
  	this.dispInfo.date = date;
  	this.listsService.updateEntry(this.dispInfo).subscribe();
  }

  changeState(entry: Entries, state: string) {
  	entry.state = state;
  	this.listsService.updateEntry(entry).subscribe();
  }

  ngOnInit() {
  }

}
