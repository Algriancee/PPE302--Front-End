
export interface FileModel {
  id: number;
  filename: string;
  originalFileName: string;
  fileType: string;
  fileSize: string;
  filePath: string;
  description: string;
  uploadTime: string;
  joueurId: number | null;
}

export interface UploadResponse {
  message: string;
  id: number;
  nom: string;
  type: string;
  taille: string;
}
