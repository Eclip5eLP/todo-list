import { Component, OnInit, Input } from '@angular/core';
import { Entries } from "../entries";
import { Lists } from "../lists";
import { Users } from "../users";
import { setCookie } from "../cookie-utils";
import { getCookie } from "../cookie-utils";
import { deleteCookie } from "../cookie-utils";
import { DatePipe } from '@angular/common';
import { LoadListsService } from "../load-lists.service";

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';
import { MessageService } from "../message.service";

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
  @Input() dispUser: Users;
  @Input() dispList: Lists;
  @Input() dispEntry: Entries;

  saveUser(): void {
    this.listsService.updateUser(this.dispUser).subscribe(f => {
      this.dispUser = null;
    });
  }

  saveList(): void {
    this.listsService.updateList(this.dispList).subscribe(f => {
      this.dispList = null;
    });
  }

  saveEntry(date: any): void {
    if (!date) {
      date = this.dispEntry.date
    } else {
      let data = date.split("/");
      date = data[1] + "/" + data[0] + "/" + data[2];
      this.dispEntry.date = date;
    }
    this.dispEntry.list = this.dispEntry.list;
    this.listsService.updateEntry(this.dispEntry).subscribe(f => {
      this.dispEntry = null;
    });
  }

  constructor(
    private listsService: LoadListsService,
    private datepipe: DatePipe,
    public messageService: MessageService
  ) { }

  save(date: any): void {
  	if (!date) { console.log("Cannot Save invalid date"); this.messageService.add("Cannot Save invalid date"); return; }
    let data = date.split("/");
    date = data[1] + "/" + data[0] + "/" + data[2];
  	this.dispInfo.date = date;
  	this.listsService.updateEntry(this.dispInfo).subscribe(f => {
      this.dispInfo = null;
    });
  }

  changeState(entry: Entries, state: any) {
  	entry.state = state;
  	this.listsService.updateEntry(entry).subscribe();
  }

  ngOnInit() {
  }

}
