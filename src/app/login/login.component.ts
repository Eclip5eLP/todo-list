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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private login_u = "";
  private login_p = "";
  private register_u = "";
  private register_p = "";
  users: any;

  //Generate ID for new User
  genId(usr: Users[]): number {
    return usr.length > 0 ? Math.max(...usr.map(usr => usr.id)) + 1 : 11;
  }

  //Login Logic
  login() {
  	let success = false;
  	this.getListsService.checkLogin(this.login_u, this.login_p).subscribe(success => {
  		if (success != false && success != undefined) {
  			this.getListsService.user = this.login_u;
  			setCookie("username", this.login_u);
  			setCookie("apikey", success.key);
  			return;
  		}
  		console.log("Failed to Login");
  		return
  	});
  }

  //Register Logic
  register() {
    this.register_u = this.register_u.trim();
  	if (!this.register_u) { console.log("Name cannot be empty"); return; }
  	for (let i = 0; i < this.users.length; i++) {
  		if (this.users[i].username == this.register_u) {
	  		console.log("Name already in use");
	  		return;
	  	}
  	}
	let usr = {id: this.genId(this.users), username: this.register_u, password: this.register_p, email: "", active: true, apikey: "null", roles: ["user"]};
	this.getListsService.createUser(usr as Users)
  	.subscribe(usr => {
  		this.refresh();
  	});
  }

  //Logout
  logout() {
  	deleteCookie("username");
  	this.refresh();
  }

  //Get current User Information
  loadUsers(): void {
    this.getListsService.loadUsers().subscribe(users => {
      this.users = users;
    });
  }

  //Refresh Browser Window
  refresh(): void {
    window.location.reload();
  }

  constructor(
  	private getListsService: LoadListsService,
  	private datepipe: DatePipe
  ) { }

  ngOnInit() {
  	this.loadUsers();

  	//Auto Login if Cookies valid
  	let u = getCookie("username");
  	let key = getCookie("apikey");
  	if (u != undefined && key != "false") {
  		this.getListsService.checkLoginKey(u, key).subscribe(success => {
	  		if (success == true) {
	  			this.getListsService.user = u;
          console.log("Logged in via Cookie");
	  			return;
	  		}
	  		console.log("Failed to Login via Cookie");
	  	});
  	}
  }

}
