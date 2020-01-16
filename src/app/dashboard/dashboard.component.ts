import { Component, OnInit, Input } from '@angular/core';
import { Entries } from "../entries";
import { Lists } from "../lists";
import { Users } from "../users";
import { LoadListsService } from "../load-lists.service";
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
  	{provide: DateAdapter, useClass: AppDateAdapter},
  	{provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
  	DatePipe
  ]
})
export class DashboardComponent implements OnInit {
  lists: Lists[];
  tasks: Entries[];
  dispInfo = null;

  constructor(
  	private getListsService: LoadListsService,
  	private datepipe: DatePipe
  ) { }

  ngOnInit() {
  	this.getLists();
  }

  //Generate ID for new List
  genId(lists: Lists[]): number {
    return lists.length > 0 ? Math.max(...lists.map(list => list.id)) + 1 : 11;
  }

  //Create a new List
  addList(name: string): void {
    name = name.trim();
    if (!name) { console.log("Name cannot be empty"); return; }
    let list = {id: this.genId(this.lists), name: name, users:[this.getListsService.user]};
    this.getListsService.addList(list as Lists)
      .subscribe(list => {
        this.lists.push(list);
      });
  }

  //Better getTime function
  //Overwrites standard one
  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  //Change State of Entry
  changeState(entry: Entries): void {
  	this.getListsService.changeState(entry).subscribe(ref => this.refresh());
  }

  //Show Edit Dialogue for Entry
  showInfo(entry: Entries): void {
	  if (this.dispInfo == null) this.dispInfo = entry;
  }

  //Delete Entry
  delete(entry: Entries): void {
  	this.tasks = this.tasks.filter(h => h != entry);
  	this.getListsService.removeEntry(entry).subscribe();
  }

  //Refresh Browser Window
  refresh(): void {
    window.location.reload();
  }

  //Get all Lists for current User
  //(TODO) Add Important/Urgent Task displaying
  getLists(): void {
    this.getListsService.getLists()
      .subscribe(lists => {
        /*
        this.tasks = lists.sort((a,b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.tasks = this.tasks.reverse();
        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].date === "?") {
            this.tasks[i].dispdate = "?";
          } else {
            this.tasks[i].dispdate = this.datepipe.transform(this.tasks[i].date, 'dd/MM/yyyy');
          }
        }
        let nt = [];
        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].date !== "?" && this.tasks[i].state !== "done") {
            nt[nt.length] = this.tasks[i];
          }
        }
        this.tasks = nt;
        */
        this.lists = lists;
      }
    );
  }
}
