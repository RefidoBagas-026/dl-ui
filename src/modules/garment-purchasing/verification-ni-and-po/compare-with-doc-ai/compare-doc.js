import { inject } from 'aurelia-framework';

@inject()
export class CompareDoc {
  pdfUrl = null;

  constructor() {
    // Inisialisasi jika diperlukan
  }

  onPdfSelected(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (this.pdfUrl) {
        URL.revokeObjectURL(this.pdfUrl);
      }
      this.pdfUrl = URL.createObjectURL(file);
    } else {
      this.pdfUrl = null;
    }
  }

  detached() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
  }

  // Tambahkan logic perbandingan dokumen di sini
}
