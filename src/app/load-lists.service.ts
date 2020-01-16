import { Injectable } from '@angular/core';
import { Entries } from "./entries";
import { Lists } from "./lists";
import { Users } from "./users";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { Observable , of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { MessageService } from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class LoadListsService {
  private listsUrl = "http://localhost:4200/api";
  public user = null;

  httpOptions = {
  	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getLists(): Observable<Lists[]> {
    return this.http.get<Lists[]>(this.listsUrl + "/u/" + this.user);
    console.log(this.router.url);
  }

  getAllLists(): Observable<Lists[]> {
    return this.http.get<Lists[]>(this.listsUrl + "/lists");
    console.log(this.router.url);
  }

  hasRole(usr: Users, role: String): Boolean {
    if (usr == null || usr == undefined) return false;
    console.log("Check Role: " + usr.username + " = " + usr.roles + " ? " + role);
    for (let i = 0; i < usr.roles.length; i++) {
      if (usr.roles[i] == role) return true;
    }
    return false;
  }

  listCheckOwner(): Observable<Lists[]> {
    let idd = window.location.pathname.split("/").pop();
    return this.http.get<Lists[]>(this.listsUrl + "/lists/o/" + idd);
  }

  getEntries(): Observable<Entries[]> {
    let uri = this.router.url.replace(/lists/gi, "");
    uri = uri.replace(/\/\//gi, "");
    return this.http.get<Entries[]>(this.listsUrl + "/lists/e/" + uri)
      .pipe(map(response => { return this.validateStates(response); }));
  }

  getAllEntries(): Observable<Entries[]> {
    return this.http.get<Entries[]>(this.listsUrl + "/entries")
      .pipe(map(response => { return this.validateStates(response); }));
  }

  loadUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.listsUrl + "/users");
  }

  createUser(usr: Users): Observable<Users> {
    return this.http.post<Users>(this.listsUrl + "/users", usr, this.httpOptions).pipe(
      tap((newUser: Users) => { console.log("Created new User"); }),
      catchError(this.handleError<Users>("addUser"))
    );
  }

  checkLogin(name: String, pass: String): Observable<any> {
    return this.http.post<any>(this.listsUrl + "/login", '{"name":"' + name + '", "pass":"' + pass + '"}', this.httpOptions).pipe(
      catchError(this.handleError<any>("checkLogin"))
    );
  }

  checkLoginKey(name: String, key: String): Observable<Boolean> {
    let payload = JSON.parse('{"name":"' + name + '", "apikey":"' + key + '"}');
    return this.http.post<Boolean>(this.listsUrl + "/login/key", payload, this.httpOptions).pipe(
      catchError(this.handleError<Boolean>("checkLoginKey"))
    );
  }

  validateStates(lists: Entries[]): Entries[] {

    for (let i = 0; i < lists.length; i++) {
  		//Compare Dates and apply state
  		if (lists[i].date === "?" && lists[i].state != "important" && lists[i].state != "done") {
  			lists[i].state = "todo";
  		} else if (lists[i].state != "important" && lists[i].state != "done") {
	  		let data = this.datepipe.transform(lists[i].date, 'dd/MM/yyyy').split("/");
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
    let idd = window.location.pathname.split("/").pop();
  	return this.http.post<Entries>(this.listsUrl + "/lists/a/" + idd, entry, this.httpOptions).pipe(
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

  addList (list: Lists): Observable<Lists> {
    return this.http.post<Lists>(this.listsUrl + "/lists", list, this.httpOptions).pipe(
      tap((newList: Lists) => { console.log("Created new List"); this.refresh(); }),
      catchError(this.handleError<Lists>("addList"))
    );
  }

  refresh(): void {
  	window.location.reload();
  }

  searchEntry(term: string): Observable<Entries[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Entries[]>(`${this.listsUrl}/search/${term}`).pipe(
      tap(_ => console.log(`Searching entries matching "${term}"`)),
      catchError(this.handleError<Entries[]>('searchEntry', [])),
      map(response => { return this.validateStates(response); })
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  changeState (entry: Entries): Observable<Entries> {
    if (entry.isDone) {
      entry.isDone = false;
      entry.state = "todo";
    } else {
      entry.isDone = true;
      entry.state = "done";
    }
    return this.http.put(`${this.listsUrl}/${entry.id}`, entry, this.httpOptions).pipe(
      tap(_ => console.log("State updated")),
      catchError(this.handleError<any>("changeState"))
    );
  }
  
  updateEntry (entry: Entries): Observable<Entries> {
    this.messageService.add("Entry Saved");
    return this.http.put(`${this.listsUrl}/${entry.id}`, entry, this.httpOptions).pipe(
      tap(_ => {
        console.log("Entry updated");
      }),
      catchError(this.handleError<any>("updateEntry"))
    );
  }

  constructor(
    private http: HttpClient,
    private datepipe: DatePipe,
    public messageService: MessageService,
    private router: Router
  ) { }
}

/*
entries format:
id
name
info
date
isDone
isImportant
isUrgent

lists format:
id
name
users

users format:
id
username
password
email
active
apikey
roles
*/