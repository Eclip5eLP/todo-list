import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Entries } from "../entries";
import { Lists } from "../lists";
import { Users } from "../users";
import { Observable, Subject, of } from 'rxjs';
import { LoadListsService } from "../load-lists.service";
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker'; 
import { EntryFilterComponent } from "../entry-filter/entry-filter.component";
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MessageService } from "../message.service";

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
  lists: any;
  lists$: any;
  LISTS: any;
  private searchTerms = new Subject<string>();
  showFilter: boolean = false;
  allEntries: any;
  public allowView = false;
  tab = "";
  private temp: any;

  constructor(
  	public getListsService: LoadListsService,
  	private datepipe: DatePipe,
    public messageService: MessageService
  ) { }

  //Submit Search Term to Server
  search(term: string): void {
  	if (term == "") {
  		this.showFilter = false;
  	} else {
  		this.showFilter = true;
  	}
    this.searchTerms.next(term);

  }

  //isType functions
  isArray(arr) { return Array.isArray(arr); }
  isObject(obj) { if (obj instanceof Object) return true; else return false; }
  isSubject(sub) { if (sub instanceof Subject) return true; else return false; }

  //Generate ID for new Entry
  genId(entry: Entries[]): number {
    //return entry.length > 0 ? Math.max(...entry.map(entry => entry.id)) + 1 : 11;
    if (entry.length) return entry[entry.length - 1].id + 1;
    return 1;
  }
  
  //Change state of Entry
  changeState(entry: Entries): void {
  	this.getListsService.changeState(entry).subscribe();
  }

  //Show Edit Dialogue for Entry
  showInfo(entry: Entries): void {
    this.dispInfo = null;
    this.temp = entry;
    setTimeout((entry) => {
      this.dispInfo = this.temp;
    }, 10);
  }

  //Refresh Browser Window
  refresh(): void {
    window.location.reload();
  }

  //Get all Entries of current List
  getLists(): void {
  	this.getListsService.getEntries().subscribe(lists => {
      this.lists = lists;
      for (let i = 0; i < lists.length; i++) {
      	if (this.lists[i].date === "?") {
      		this.lists[i].dispdate = "?";
      	} else {
        	this.lists[i].dispdate = this.datepipe.transform(lists[i].date, 'dd/MM/yyyy');
      	}
      }
    });
  }

  //Check if User is allowed to view and edit current List
  ownsList(): void {
    this.getListsService.listCheckOwner().subscribe(list => {
      for (let i = 0; i < list[0].users.length; i++) {
        if (list[0].users[i] == this.getListsService.user) this.allowView = true;
      }
    });
  }

  //Get all Entries
  getAllEntries(): void {
    this.getListsService.getAllEntries().subscribe(e => {
      this.allEntries = e;
    });
  }

  //Get all Lists
  getAllLists(): void {
    this.getListsService.getAllLists()
      .subscribe(lists => {
        this.LISTS = lists;
      }
    );
  }

  //Add new Entry to current List
  add(name: string): void {
  	name = name.trim();
    var idd = window.location.pathname.split("/").pop();
  	if (!name) { console.log("Name cannot be empty"); return; }
	  let entry = {name: name, isDone: false, isImportant: false, isUrgent: false, state: "todo", date: "?", info: "No Info yet", id: this.genId(this.allEntries), list: parseInt(idd)};
  	this.getListsService.addEntry(entry as Entries)
  	  .subscribe(entryx => {
  	  	this.lists.push(entry);
        this.getLists();
  	  });
  }

  //Delete Entry from current List
  delete(entry: Entries): void {
  	this.lists = this.lists.filter(h => h != entry);
  	this.getListsService.removeEntry(entry).subscribe();
  }

  //Delete List
  delList(): void {
    var idd = window.location.pathname.split("/").pop();
    this.getListsService.deleteList(parseInt(idd)).subscribe();
  }

  //Change Tab to ID
  loadTab(): void {
    setTimeout(() => {
      this.tab = window.location.pathname.split("/").pop();
      this.getAllLists();
      this.getLists();
      this.getAllEntries();
      this.ownsList();
    }, 10);
  }

  ngOnInit() {
    this.tab = window.location.pathname.split("/").pop();
    this.getAllLists();
  	this.getLists();
    this.getAllEntries();
    this.ownsList();

    //Filter Logic
  	this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.getListsService.searchEntry(term)),
    ).subscribe(list => {
    	this.lists$ = list;
    });
  }
}
