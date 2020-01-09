import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Entries } from './entries';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const lists = [
      	{ name: "Done", state: "todo", id: 1, info: "Do Today", date: "09/01/2020" },
	  	{ name: "Todo 1", state: "todo", id: 2, info: "Info 2", date: "12/01/2020" },
	  	{ name: "Todo 2", state: "todo", id: 3, info: "Info 3", date: "05/01/2020" },
	  	{ name: "Done", state: "todo", id: 4, info: "Info 4", date: "03/03/2020" },
	  	{ name: "Todo 3", state: "todo", id: 5, info: "Info 5", date: "11/04/2021" },
	  	{ name: "Canceled", state: "todo", id: 6, info: "Info 6", date: "01/11/2020" }
    ];
    return {lists};
  }

  genId(lists: Entries[]): number {
    return lists.length > 0 ? Math.max(...lists.map(entry => entry.id)) + 1 : 11;
  }
}