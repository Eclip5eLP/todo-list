import { Injectable } from '@angular/core';
import { Entries } from "./entries";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from '@angular/common';

import { Observable , of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoadListsService {
  private listsUrl = "api/lists";

  httpOptions = {
  	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getLists(): Observable<Entries[]> {
  	//return this.serverGetLists();
  	return this.http.get<Entries[]>(this.listsUrl)
	  	.pipe(map(response => { return this.validateStates(response); }));
  }

  serverGetLists(): Observable<Entries[]> {
  	return this.http.get<Entries[]>(this.listsUrl)
	  	.pipe(map(response => { return this.validateStates(response); }));
  }

  validateStates(lists: Entries[]): Entries[] {
  	for (let i = 0; i < lists.length; i++) {
  		//Compare Dates and apply state
  		if (lists[i].date === "?" && lists[i].state != "important" && lists[i].state != "done") {
  			lists[i].state = "todo";
  		} else if (lists[i].state != "important" && lists[i].state != "done") {
	  		let data = this.datepipe.transform(lists[i].date, 'MM/dd/yyyy').split("/");
	  		let day = +data[0];
	  		let month = +data[1];
	  		let year = +data[2];

	  		let d = new Date();
	  		let today = ("0" + d.getDate()).slice(-2) + "/" + ("0"+(d.getMonth()+1)).slice(-2) + "/" + d.getFullYear();
	  		let tdata = today.split("/");
	  		let tday = +tdata[0];
	  		let tmonth = +tdata[1];
	  		let tyear = +tdata[2];

	  		//Check Overdue
	  		if (tyear > year) { //Year
	  			lists[i].state = "overdue";
	  			console.log("'" + lists[i].name + "' Overdue: Past Year");
	  		} else if (tmonth > month) { //Month
	  			lists[i].state = "overdue";
	  			console.log("'" + lists[i].name + "' Overdue: Past Month");
	  		} else if (tday > day && tmonth == month) { //Day
	  			lists[i].state = "overdue";
	  			console.log("'" + lists[i].name + "' Overdue: Past Days");
	  		} else if (month <= tmonth + 1 && day <= 2 && tday >= 28) {
	  			lists[i].state = "urgent";
	  			console.log("'" + lists[i].name + "' Urgent: Beware new Month");
	  		} else if (day <= (tday + 2) && tmonth == month) { //Day
	  			lists[i].state = "urgent";
	  			console.log("'" + lists[i].name + "' Urgent: In less than 2 Days");
	  		}
  		} else if (lists[i].state == "important") {
  			//Do nothing
  		}
  	}

  	return lists;
  }

  addEntry (entry: Entries): Observable<Entries> {
  	return this.http.post<Entries>(this.listsUrl, entry, this.httpOptions).pipe(
  	  tap((newEntry: Entries) => { console.log("Added new Entry to List"); this.refresh(); }),
  	  catchError(this.handleError<Entries>("addEntry"))
  	);
  }

  removeEntry (entry: Entries | number): Observable<Entries> {
  	const id = typeof entry === "number" ? entry : entry.id;
  	const url = `${this.listsUrl}/${id}`;

  	return this.http.delete<Entries>(url, this.httpOptions).pipe(
  	  tap(_ => console.log("Entry removed")),
  	  catchError(this.handleError<Entries>("removeEntry"))
  	);
  }

  updateEntry (entry: Entries): Observable<Entries> {
  	return this.http.put(this.listsUrl, entry, this.httpOptions).pipe(
  	  tap(_ => console.log("Entry updated")),
  	  catchError(this.handleError<any>("updateEntry"))
  	);
  }

  changeState (entry: Entries): Observable<Entries> {
  	if (entry.state != "done") {
		entry.state = "done";
	} else if (entry.state == "done") {
		//TODO: Check for State
		entry.state = "todo";
	}
	return this.http.put(this.listsUrl, entry, this.httpOptions).pipe(
  	  tap(_ => console.log("State updated")),
  	  catchError(this.handleError<any>("changeState"))
  	);
  }

  refresh(): void {
  	window.location.reload();
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  constructor(private http: HttpClient, public datepipe: DatePipe) { }
}
