import { inject, customElement } from 'aurelia-framework';

@customElement('upload-pdf')
@inject()
export class UploadPdf {
  file = null;
  uploading = false;
  uploadError = '';

  onFileChange(event) {
    const files = event.target.files;
    if (files && files[0]) {
      this.file = files[0];
      this.uploadError = '';
    }
  }

  async uploadFile() {
    if (!this.file) {
      this.uploadError = 'Please select a PDF file.';
      return;
    }
    this.uploading = true;
    // Implement upload logic here (API call, etc)
    // Example: await someService.uploadPdf(this.file);
    setTimeout(() => {
      this.uploading = false;
      alert('File uploaded (simulasi).');
    }, 1000);
  }

  clearFile() {
    this.file = null;
    this.uploadError = '';
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }
}
