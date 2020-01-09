import { Component, OnInit, Input } from '@angular/core';
import { Entries } from "../entries";
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
  lists: Entries[];
  tasks: Entries[];
  dispInfo = null;

  constructor(
  	private getListsService: LoadListsService,
  	private datepipe: DatePipe
  ) { }

  ngOnInit() {
  	this.getLists();
  }

  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  changeState(entry: Entries): void {
  	this.getListsService.changeState(entry).subscribe();
  }

  showInfo(entry: Entries): void {
	this.dispInfo = entry;
  }

  delete(entry: Entries): void {
  	this.tasks = this.tasks.filter(h => h != entry);
  	this.getListsService.removeEntry(entry).subscribe();
  }

  getLists(): void {
  	this.getListsService.getLists()
  		.subscribe(lists => {
  			this.tasks = lists.sort((a,b) => {
  				return new Date(b.date).getTime() - new Date(a.date).getTime();
  			});
  		}
  	);
  }
}
