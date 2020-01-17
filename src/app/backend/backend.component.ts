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

  constructor(
  	private getListsService: LoadListsService,
  	private datepipe: DatePipe
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
