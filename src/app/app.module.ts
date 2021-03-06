import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http";
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";

import { DatePipe } from '@angular/common';
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { DashboardComponent } from "./dashboard/dashboard.component"
import { TodoListComponent } from './todo-list/todo-list.component';
import { ShowInfoComponent } from './show-info/show-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesComponent } from './messages/messages.component';
import { EntryFilterComponent } from './entry-filter/entry-filter.component';
import { LoginComponent } from './login/login.component';
import { BackendComponent } from './backend/backend.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    ShowInfoComponent,
    DashboardComponent,
    MessagesComponent,
    EntryFilterComponent,
    LoginComponent,
    BackendComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [ MatDatepickerModule, DatePipe ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
