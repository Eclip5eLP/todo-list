import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Entries } from "../entries";
import { Observable, Subject, of } from 'rxjs';
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
  lists$: Observable<Entries[]>;
  showFiltered: boolean;

  constructor(
  	private getListsService: LoadListsService,
  	private datepipe: DatePipe
  ) { }

  isArray(arr) { return Array.isArray(arr); }
  isObject(obj) { if (obj instanceof Object) return true; else return false; }
  isSubject(sub) { if (sub instanceof Subject) return true; else return false; }

  isFilter(): boolean {
    return this.showFiltered;
  }

  filterChange(event) {
    this.lists$ = event;
  }

  genId(lists: Entries[]): number {
    return lists.length > 0 ? Math.max(...lists.map(entry => entry.id)) + 1 : 11;
  }
  
  changeState(entry: Entries): void {
  	this.getListsService.changeState(entry).subscribe();
  }

  showInfo(entry: Entries): void {
	  this.dispInfo = entry;
  }

  getLists(): void {
  	this.getListsService.getLists().subscribe(lists => {
      this.lists = lists;
      for (let i = 0; i < lists.length; i++) {
        this.lists[i].dispdate = this.datepipe.transform(lists[i].date, 'dd/MM/yyyy');
      }
    });
  }

  add(name: string): void {
  	name = name.trim();
  	if (!name) { console.log("Name cannot be empty"); return; }
	  let entry = {name: name, state: "todo", date: "?", info: "No Info yet", id: this.genId(this.lists)};
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