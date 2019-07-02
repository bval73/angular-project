import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  componentTitle = "I am app component from component.ts";

  clickHandler(){
    console.log('The button was clicked ');
  }

}

