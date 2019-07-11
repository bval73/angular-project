import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';

import { RentalComponent } from './rental.component';

import {RentalService} from './shared/rental.service';
import { RentalDetailComponent } from './rental-detail/rental-detail.component';

const routes: Routes = [
    {  path:'rentals', 
       component:RentalComponent,
       children:[
        {path: '', component: RentalListComponent},
        {path: ':rentalId', component: RentalDetailComponent}
       ]
    }
//    {path:'temp', component:TempComponent}
  //  {path:'new-cmp', component:NewCmpComponent} // could also use tag <new-cmp> </new-cmp> and it would inject it into the page.....
]

@NgModule({
    declarations: [
        RentalListComponent,
        RentalListItemComponent,
        RentalComponent,
        RentalDetailComponent
    ],
    imports:[CommonModule,
    RouterModule.forChild(routes)],
    providers:[RentalService]
})


export class RentalModule{}


