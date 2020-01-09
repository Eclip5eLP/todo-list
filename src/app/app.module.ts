import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    ShowInfoComponent,
    DashboardComponent
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
  bootstrap: [AppComponent]
})
export class AppModule { }
