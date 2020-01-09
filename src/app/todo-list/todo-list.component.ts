import { Component, OnInit, Input } from '@angular/core';
import { Entries } from "../entries";
import { LoadListsService } from "../load-lists.service";
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  providers: [
  	{provide: DateAdapter, useClass: AppDateAdapter},
  	{provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
  	DatePipe
  ]
})
export class TodoListComponent implements OnInit {
  dispInfo = null;
  lists: Entries[];

  constructor(
  	private getListsService: LoadListsService,
  	private datepipe: DatePipe
  ) { }

  changeState(entry: Entries): void {
  	this.getListsService.changeState(entry).subscribe();
  }

  showInfo(entry: Entries): void {
	this.dispInfo = entry;
  }

  getLists(): void {
  	this.getListsService.getLists().subscribe(lists => this.lists = lists);
  }

  add(name: string): void {
  	name = name.trim();
  	if (!name) { console.log("Name cannot be empty"); return; }
	let entry = {name: name, state: "todo", date: "?", info: "No Info yet", id: 0};
  	this.getListsService.addEntry(entry as Entries)
  	  .subscribe(entry => {
  	  	this.lists.push(entry);
  	  });
  }

  delete(entry: Entries): void {
  	this.lists = this.lists.filter(h => h != entry);
  	this.getListsService.removeEntry(entry).subscribe();
  }

  ngOnInit() {
  	this.getLists();
  }

}
