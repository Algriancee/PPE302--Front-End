import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileModel, UploadResponse } from '../Models/file.model';

@Injectable({ providedIn: 'root' })
export class FileService {

  private apiUrl = 'http://localhost:8080/Files';

  constructor(private http: HttpClient) {}

  // ← Upload avec joueurId
  uploadFile(file: File, description: string = '', joueurId?: number): Observable<HttpEvent<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    if (joueurId) formData.append('joueurId', String(joueurId));

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request<UploadResponse>(req);
  }

  getAllFiles(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(this.apiUrl);
  }

  getPdfs(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(`${this.apiUrl}/pdfs`);
  }

  getVideos(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(`${this.apiUrl}/videos`);
  }

  // ← Fichiers d'un joueur
  getFilesByJoueur(joueurId: number): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(`${this.apiUrl}/joueur/${joueurId}`);
  }

  // ← Vidéos d'un joueur
  getVideosByJoueur(joueurId: number): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(`${this.apiUrl}/joueur/${joueurId}/videos`);
  }

  // ← URL de streaming direct (avec token dans header via interceptor)
  getStreamUrl(id: number): string {
    return `${this.apiUrl}/${id}/stream`;
  }

  // ← Blob pour lecture sécurisée
  streamVideo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/view`, { responseType: 'blob' });
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  triggerDownload(id: number, originalFileName: string): void {
    this.downloadFile(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalFileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  deleteFile(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  isVideo(fileType: string): boolean {
    return fileType?.startsWith('video/');
  }

  isPdf(fileType: string): boolean {
    return fileType === 'application/pdf';
  }
}
