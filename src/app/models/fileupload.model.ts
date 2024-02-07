export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  price!: string;
  file!: File;

  constructor(file: File) {
    this.file = file;
  }
}
