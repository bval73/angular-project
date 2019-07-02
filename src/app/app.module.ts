import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
//import { NewCmpComponent } from './new-cmp/new-cmp.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
//    NewCmpComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
