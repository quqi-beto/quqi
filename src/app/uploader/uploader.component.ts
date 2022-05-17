import { Component,  ElementRef, OnInit, ViewChild  } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadServiceService } from 'src/app/uploader/file-upload-service.service'

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})
export class UploaderComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  orderListAttr = '';
  wayBillAttr = '';
  currentFile?: File;
  progress = 0;
  fileInfos?: Observable<any>;
  message = '';
  inProgress = '';

  constructor(private _formBuilder: FormBuilder, private uploadService: FileUploadServiceService) { }

  ngOnInit(): void {
    
    this.uploadService.startNew().subscribe();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  selectExcelFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.orderListAttr = this.currentFile.name;
    } else {
      this.orderListAttr = 'Select File';
    }
  }

  selectPdfFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.wayBillAttr = this.currentFile.name;
    } else {
      this.wayBillAttr = 'Select File';
    }
  }

  upload(): void {
    this.inProgress = 'running';
    this.progress = 0;
    this.message = "";
    if (this.currentFile) {
    this.uploadService.upload(this.currentFile).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.uploadService.getFiles();
        }
      },
      (err: any) => {
        console.log(err);
        this.progress = 0;
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the file!';
        }
        this.currentFile = undefined;
        this.inProgress = '';
      });
    }
  }

  generate(): void {
    this.uploadService.generate().subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          
        } else if (event instanceof HttpResponse) {
          // this.message = event.body.message;
          this.fileInfos = this.uploadService.getFiles();
        }
      });
    // this.fileInfos = this.uploadService.getFiles();
  }
}
