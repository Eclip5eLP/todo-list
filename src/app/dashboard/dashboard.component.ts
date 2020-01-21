import { Component, OnInit, Input } from '@angular/core';
import { Entries } from "../entries";
import { Lists } from "../lists";
import { Users } from "../users";
import { LoadListsService } from "../load-lists.service";
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';
import { MessageService } from "../message.service";

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
  allLists: Lists[];
  tasks: Entries[];
  dispInfo = null;
  dashboard_amount = 3;
  temp: any;

  //Generate ID for new List
  genId(lists: Lists[]): number {
    //return lists.length > 0 ? Math.max(...lists.map(list => list.id)) + 1 : 11;
    if (lists.length) return lists[lists.length - 1].id + 1;
    return 1;
  }

  //Create a new List
  addList(name: string): void {
    name = name.trim();
    if (!name) { console.log("Name cannot be empty"); return; }
    let list = {id: this.genId(this.allLists), name: name, users:[this.getListsService.user]};
    this.getListsService.addList(list as Lists)
      .subscribe(listx => {
        this.lists.push(list);
        this.getLists();
      });
  }

  //Better getTime function
  //Overwrites standard one
  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  //Change State of Entry
  changeState(entry: Entries): void {
  	this.getListsService.changeState(entry).subscribe(ref => this.getLists());
  }

  //Show Edit Dialogue for Entry
  showInfo(entry: Entries): void {
	  this.dispInfo = null;
    this.temp = entry;
    setTimeout((entry) => {
      this.dispInfo = this.temp;
    }, 10);
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
  getLists(): void {
    this.getListsService.getLists()
      .subscribe(lists => {
        this.lists = lists;
      }
    );
  }

  //Get all Lists
  getAllLists(): void {
    this.getListsService.getAllLists()
      .subscribe(lists => {
        this.allLists = lists;
      }
    );
  }

  //Get All Lists of the Current User and mark them
  getDash(): void {
    this.getListsService.getLists()
      .subscribe(lists => {
        this.getListsService.getAllEntries()
          .subscribe(entries => {
            this.tasks = []
            let l = [];
            for (let i = 0; i < entries.length; i++) {
              for (let j = 0; j < lists.length; j++) {
                if (lists[j].id == entries[i].list) {
                  l[l.length] = entries[i];
                }
              }
            }

            this.tasks = l.sort((a,b) => {
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
              if (this.tasks[i].date !== "?" && !this.tasks[i].isDone) {
                nt[nt.length] = this.tasks[i];
              }
            }
            this.tasks = nt;
          }
        )
      }
    );
  }

  constructor(
    public getListsService: LoadListsService,
    private datepipe: DatePipe,
    public messageService: MessageService
  ) { }

  ngOnInit() {
    this.getLists();
    this.getAllLists();
    this.getDash();
  }
}
