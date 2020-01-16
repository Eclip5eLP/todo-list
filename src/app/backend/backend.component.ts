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
  isAdmin = true;
  tab = "admin";
  ENTRIES: Entries[];
  LISTS: Lists[];
  USERS: Users[];

  getAllEntries(): void {
    this.getListsService.getAllEntries().subscribe(e => {
      this.ENTRIES = e;
    });
  }

  getUsers(): void {
  	this.getListsService.loadUsers().subscribe(users => {
      this.USERS = users;
    });
  }

  getLists(): void {
  	this.getListsService.getAllLists().subscribe(lists => {
      this.LISTS = lists;
    });
  }

  constructor(
  	private getListsService: LoadListsService,
  	private datepipe: DatePipe
  ) { }

  ngOnInit() {
  	this.tab = window.location.pathname.split("/").pop();
  	/*
  	if (this.getListsService.hasRole(this.getListsService.user, "admin")) {
  		this.isAdmin = true;
  	} else {
  		this.isAdmin = false
  	}
  	*/

  	this.getLists();
    this.getAllEntries();
    this.getUsers();
  }

}
