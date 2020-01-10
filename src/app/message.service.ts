import { Injectable } from '@angular/core';
import { Entries } from "./entries";
import { LoadListsService } from "./load-lists.service";
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './format-datepicker';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: {msg: string, id: number}[] = [];

  add(message: string) {
  	this.messages.push({msg: message, id: this.genId()});
  }

  clear(id: number) {
  	for (let i = 0; i < this.messages.length; i++) {
  		if (this.messages[i].id == id) {
  			this.messages.splice(this.messages.indexOf(this.messages[i], 0), 1);
  		}
  	}
  }

  clearAll() {
  	this.messages = [];
  }

  genId(): number {
    return this.messages.length > 0 ? Math.max(...this.messages.map(entry => entry.id)) + 1 : 11;
  }

  constructor() { }
}
