import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';

import { CamelizePipe } from 'ngx-pipes';


import { MapService } from './map.service';


@NgModule({
  declarations: [
    MapComponent
  ],
  exports:[
    MapComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
        apiKey:  'insert your key'
    }),
    CommonModule
  ],
  providers: [
    MapService,
    CamelizePipe
  ],

})

export class MapModule {
    lat: number = 51.678418;
    lng: number = 7.809007;

 }
