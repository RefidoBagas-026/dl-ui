import { inject } from 'aurelia-framework';
import { Service } from '../service';

@inject(Service)
export class CompareDoc {
  pdfUrl = null;
  pdfPreviewUrl = null;
  search = '';
  searchResults = [];
  showDropdown = false;
  selectedNI = null;
  selectedData = null;
  loading = false;
  uploadFiles = [];
  uploadFileNames = [];
  uploadErrors = [];

  constructor(service) {
    this.service = service;
  }

  async onSearchInput(event) {
    this.search = event.target.value;
    if (this.search && this.search.length >= 1) {
      this.loading = true;
      const result = await this.service.search({ page: 1, size: 10, keyword: this.search });
      // Simpan objek, bukan hanya inNo
      this.searchResults = (result.data || []).map(x => ({ inNo: x.inNo, Id: x.Id }));
      this.showDropdown = this.searchResults.length > 0;
      this.loading = false;
    } else {
      this.searchResults = [];
      this.showDropdown = false;
    }
  }

  async selectNI(niObj) {
    this.selectedNI = niObj.inNo;
    this.search = niObj.inNo;
    this.showDropdown = false;
    this.pdfPreviewUrl = null; // reset preview setiap ganti dokumen
    // Ambil data lengkap dari backend berdasarkan Id
    if (niObj.Id) {
      this.loading = true;
      const detail = await this.service.getById(niObj.Id);
      this.selectedData = detail && detail.data ? detail.data : detail; // fallback jika detail.data undefined
      this.loading = false;
    } else {
      this.selectedData = niObj; // fallback agar selectedData tidak null
    }
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

  // Fungsi untuk cetak PDF saat tombol Cari diklik
  async printPdf() {
    // Nonaktifkan fetch PDF, hanya tampilkan iframe kosong
    // this.pdfPreviewUrl = null; // jika ingin kosongkan iframe
    this.pdfPreviewUrl = 'about:blank'; // tampilkan iframe kosong
    // Jika ingin menampilkan pesan khusus di iframe, bisa gunakan data URL
    // this.pdfPreviewUrl = 'data:text/html,<h2 style="text-align:center;margin-top:40px;">PDF Preview Disabled</h2>';
  }

  // Fungsi untuk notifikasi sukses cek NI dan PO
  cekNiPo() {
    // Tampilkan notifikasi atau event sukses
    if (window && window.alert) {
      window.alert('Check Success!');
    }
    // Atau trigger event custom jika dibutuhkan
    // let event = new CustomEvent('cek-ni-po-success', { detail: { message: 'Check Success!' } });
    // window.dispatchEvent(event);
  }

  onAddUploadFile() {
    this.uploadFiles.push(null);
    this.uploadFileNames.push("");
    this.uploadErrors.push("");
  }

  onRemoveUploadFile(index) {
    this.uploadFiles.splice(index, 1);
    this.uploadFileNames.splice(index, 1);
    this.uploadErrors.splice(index, 1);
  }

  triggerUploadInput(index) {
    const input = document.getElementById('uploadInput' + index);
    if (input) {
      input.click();
    }
  }

  onUploadFileChanged(index, event) {
    const file = event.target.files[0];
    if (!file) {
      this.uploadFiles[index] = null;
      this.uploadFileNames[index] = "";
      this.uploadErrors[index] = "File is required.";
      return;
    }
    if (file.type !== 'application/pdf') {
      this.uploadFiles[index] = null;
      this.uploadFileNames[index] = "";
      this.uploadErrors[index] = "Only PDF files are allowed.";
      event.target.value = '';
      return;
    }
    // File valid
    this.uploadFiles[index] = file;
    this.uploadFileNames[index] = file.name;
    this.uploadErrors[index] = "";
  }
}
