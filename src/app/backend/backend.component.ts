import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Entries } from "../entries";
import { Lists } from "../lists";
import { Users } from "../users";
import { setCookie } from "../cookie-utils";
import { getCookie } from "../cookie-utils";
import { deleteCookie } from "../cookie-utils";
import { Observable, Subject, of } from 'rxjs';
import { LoadListsService } from "../load-lists.service";
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker'; 
import { EntryFilterComponent } from "../entry-filter/entry-filter.component";
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MessageService } from "../message.service";

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements OnInit {
  tab = "admin";
  isAdmin = false;
  ENTRIES: Entries[];
  LISTS: Lists[];
  USERS: Users[];
  dispUser: Users;
  dispEntry: Entries;
  dispList: Lists;
  temp: any;

  //Goto List
  gotoList(id: any): void {
    window.location.href = window.location.origin + "/lists/" + id;
  }

  //Get all Entries
  getAllEntries(): void {
    this.getListsService.getAllEntries().subscribe(e => {
      this.ENTRIES = e;
    });
  }

  //Get all Users
  getUsers(): void {
  	this.getListsService.loadUsers().subscribe(users => {
      this.USERS = users;
    });
  }

  //Get all Lists
  getLists(): void {
  	this.getListsService.getAllLists().subscribe(lists => {
      this.LISTS = lists;
    });
  }

  //Check if User is Admin
  checkAdmin(): void {
    this.getListsService.loadUsers().subscribe(users => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == getCookie("username")) {
          for (let j = 0; j < users[i].roles.length; j++) {
            if (users[i].roles[j] == "admin") this.isAdmin = true;
          }
        }
      }
    });
  }

  //(TODO) Add Management Logic

  //Generate ID for new List
  genIdList(lists: Lists[]): number {
    if (lists.length) return lists[lists.length - 1].id + 1;
    return 1;
  }

  //Generate ID for new Entry
  genIdEntry(entry: Entries[]): number {
    if (entry.length) return entry[entry.length - 1].id + 1;
    return 1;
  }

  //Delete a User
  deleteUser(user: Users): void {
    this.USERS = this.USERS.filter(h => h != user);
    this.getListsService.deleteUser(user).subscribe();
  }

  //Delete a List
  deleteList(list: Lists): void {
    this.LISTS = this.LISTS.filter(h => h != list);
    this.getListsService.deleteList(list).subscribe();
  }

  //Delete an Entry
  deleteEntry(entry: Entries): void {
    this.ENTRIES = this.ENTRIES.filter(h => h != entry);
    this.getListsService.removeEntry(entry).subscribe();
  }

  //Show Edit Dialogue for Users
  editUser(user: Users): void {
    this.dispUser = null;
    this.temp = user;
    setTimeout((user) => {
      this.dispUser = this.temp;
    }, 10);
  }

  //Show Edit Dialogue for Lists
  editList(list: Lists): void {
    this.dispList = null;
    this.temp = list;
    setTimeout((list) => {
      this.dispList = this.temp;
    }, 10);
  }

  //Show Edit Dialogue for Entries
  editEntry(entry: Entries): void {
    this.dispEntry = null;
    this.temp = entry;
    setTimeout((entry) => {
      this.dispEntry = this.temp;
    }, 10);
  }

  //Add a new List
  addList(name: string): void {
    name = name.trim();
    if (!name) { console.log("Name cannot be empty"); return; }
    let list = {id: this.genIdList(this.LISTS), name: name, users:["system"]};
    this.getListsService.addList(list as Lists)
      .subscribe(listx => {
        this.LISTS.push(list);
      });
  }

  //Add a new Entry
  addEntry(name: string): void {
    name = name.trim();
    if (!name) { console.log("Name cannot be empty"); return; }
    let entry = {name: name, isDone: false, isImportant: false, isUrgent: false, date: "?", info: "No Info yet", id: this.genIdEntry(this.ENTRIES), list: -1, state: "todo", dispdate: "?"};
    this.getListsService.addEntry(entry as Entries)
      .subscribe(entryx => {
        this.ENTRIES.push(entry);
      });
  }

  constructor(
  	public getListsService: LoadListsService,
  	private datepipe: DatePipe,
    public messageService: MessageService
  ) { }

  ngOnInit() {
    this.tab = window.location.pathname.split("/").pop();

    //Get all needed Entities
  	this.getLists();
    this.getAllEntries();
    this.getUsers();

    this.checkAdmin();
  }

}
