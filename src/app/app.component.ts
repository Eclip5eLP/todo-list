import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public dateValue: Date = new Date();
  title = 'ToDo-List';
  subtitle = "Dev Environment";
}
