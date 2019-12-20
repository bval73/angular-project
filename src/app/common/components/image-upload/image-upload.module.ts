import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ImageUploadComponent} from './image-upload.component';

import { ImageUploadService} from './image-upload.service'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ImageCropperModule
  ],
  providers: [
    ImageUploadService
  ],
  exports: [
    ImageUploadComponent,
  ],
  declarations: [
    ImageUploadComponent,
  ],
})
export class ImageUploadModule { }