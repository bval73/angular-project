import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageUploadService } from './image-upload.service';
import { ToastrService } from 'ngx-toastr';


class FileSnippet {
  static readonly IMAGE_SIZE = {width: 950, height: 720};

  pending: boolean = false;
  status: string = 'INIT';
  
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'bwm-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {

  @Output() imageUploaded = new EventEmitter();
  @Output() imageError = new EventEmitter();
  @Output() imageLoadedToContainer = new EventEmitter();
  @Output() croppingCanceled = new EventEmitter();


  selectedFile: FileSnippet;
  imageChangedEvent: any;

  constructor(private toastr: ToastrService, 
              private imageService: ImageUploadService){
              }

  private onSuccess(imageUrl: string) {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'OK';
    this.imageChangedEvent = null; //hide cropper
    this.imageUploaded.emit(imageUrl);
  }

  private onFailure() {
    this.selectedFile.pending = true;
    this.selectedFile.status = 'FAIL';
    this.imageChangedEvent = null; //hide cropper
    this.imageError.emit('');
  }

  imageCropped(file: File): FileSnippet | File {

    if(this.selectedFile){
      return this.selectedFile.file = file;
    }
    return this.selectedFile = new FileSnippet('', file);
  }

  imageLoaded() {
    this.imageLoadedToContainer.emit();
  }

  cancelCropping() {
    this.imageChangedEvent = null; //hide cropper
    this.croppingCanceled.emit();
  }

  processFile(event: any) {
    this.selectedFile = undefined;

    const URL = window.URL;
    let file, img;
    if((file = event.target.files[0]) && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      img = new Image();

      const self = this;
      img.onload = function() {

        if(this.width > FileSnippet.IMAGE_SIZE.width && this.height > FileSnippet.IMAGE_SIZE.height) {
          self.imageChangedEvent = event;
        } else {
          self.toastr.error(`Minimum width is ${FileSnippet.IMAGE_SIZE.width} and minimum height is ${FileSnippet.IMAGE_SIZE.height}`, 'Image Upload Error');
        }
      }

      img.src = URL.createObjectURL(file);
    } else {
      this.toastr.error('Unsupported file type only jpg and png allowed!', 'Image Upload Error');
    }
  }

  uploadImage() {

    if(this.selectedFile) {
      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {
        this.selectedFile.src = event.target.result; // get src in order to populate the field in html
      
        this.selectedFile.pending = true;
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl:string) => {
            this.onSuccess(imageUrl);
          },
          (errorResponse: HttpErrorResponse) => {
            this.toastr.error(errorResponse.error.errors[0].detail, 'Image Upload Error');
            this.onFailure();
          })
      });

      reader.readAsDataURL(this.selectedFile.file);
    }
  }
}
