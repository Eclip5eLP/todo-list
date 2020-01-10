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
<<<<<<< HEAD
        if (lists[i].date === "?") {
          lists[i].dispdate = "?";
        } else {
          this.lists[i].dispdate = this.datepipe.transform(lists[i].date, 'dd/MM/yyyy');
        }
=======
        this.lists[i].dispdate = this.datepipe.transform(lists[i].date, 'dd/MM/yyyy');
>>>>>>> 7c33fbd1116af133119a80fe9254e56d3023f6f3
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
