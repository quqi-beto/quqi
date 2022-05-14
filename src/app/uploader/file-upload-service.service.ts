import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadServiceService {
  
  private baseUrl = 'http://localhost:8081';
  // private baseUrl = 'https://quqi-file-uploader.herokuapp.com';

  constructor(private http: HttpClient) { }
  
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'quqi');
    const req = new HttpRequest('POST', `${this.baseUrl}/file/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  startNew(): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('userId', 'quqi');
    const req = new HttpRequest('POST', `${this.baseUrl}/file/start`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);

  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
