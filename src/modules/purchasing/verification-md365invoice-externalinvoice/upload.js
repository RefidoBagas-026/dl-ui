import { bindable } from 'aurelia-framework';

export class Upload {
  @bindable files;
  uploadedFiles = [];

  uploadFiles() {
    if (!this.files || this.files.length === 0) return;
    // Simulasi upload, replace dengan API call jika ada
    for (let i = 0; i < this.files.length; i++) {
      this.uploadedFiles.push({ name: this.files[i].name });
    }
    // Reset input
    this.files = null;
  }
}
