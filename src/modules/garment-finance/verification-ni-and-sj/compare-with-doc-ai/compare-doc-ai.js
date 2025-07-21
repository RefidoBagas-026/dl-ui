import { inject, customElement } from 'aurelia-framework';
import { Service } from '../service';


@customElement('compare-doc-ai')
@inject(Service)
export class CompareDocAi {
  constructor(service) {
    this.service = service;
    // Upload PDF logic
    this.file = null;
    this.uploading = false;
    this.uploadError = '';
  }

  search = '';
  searchResults = [];
  loading = false;
  showDropdown = false;
  selectedNotaIntern = null;
  _selectedViewData = [];
  get selectedViewData() {
    return this._selectedViewData;
  }
  set selectedViewData(val) {
    this._selectedViewData = Array.isArray(val) ? val.slice() : [];
  }

  // Fungsi untuk menangani perubahan file input PDF
  onFileChange(event) {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        this.uploadError = 'File harus bertipe PDF.';
        alert('File harus bertipe PDF.');
        this.file = null;
        return;
      }
      this.file = file;
      this.uploadError = '';
      this.scanFile(); // langsung proses scan setelah file dipilih
    }
  }

  // Fungsi untuk upload file PDF (simulasi, tidak digunakan)
  uploadFile() {
    if (!this.file) {
      this.uploadError = 'Silakan pilih file PDF.';
      return;
    }
    this.uploading = true;
    setTimeout(() => {
      this.uploading = false;
      alert('File berhasil di-upload (simulasi).');
    }, 1000);
  }

  // Fungsi untuk scan file PDF ke backend dan simpan hasilnya
  async scanFile() {
    if (!this.file) {
      this.uploadError = 'Silakan pilih file PDF untuk scan.';
      alert(this.uploadError);
      return;
    }
    this.uploading = true;
    try {
      const result = await this.service.uploadScanDeliveryOrder(this.file);
      this.uploading = false;
      if (result && result.statusCode === 200 && result.data) {
        this.scannedData = result.data;
        alert('Scan berhasil!');
        // Data hasil scan disimpan di this.scannedData, bisa diinspeksi di UI
      } else {
        const msg = result && result.message ? result.message : 'Maaf file tidak bisa terbaca.';
        alert('Maaf file tidak bisa terbaca karena: ' + msg);
      }
    } catch (err) {
      this.uploading = false;
      alert('Maaf file tidak bisa terbaca karena: ' + (err && err.message ? err.message : err));
    }
  }

  // Fungsi untuk menghapus data hasil scan dan reset file input
  clearScanData() {
    this.scannedData = null;
    this.file = null;
    this.uploadError = '';
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }

  async onSearchInput(event) {
    this.search = event.target.value;
    if (this.search && this.search.length > 1) {
      this.loading = true;
      this.showDropdown = true;
      try {
        const result = await this.service.searchInternNotes({ keyword: this.search, page: 1, size: 10 });
        this.searchResults = (result.data || []);
      } catch (e) {
        this.searchResults = [];
      }
      this.loading = false;
    } else {
      this.searchResults = [];
      this.showDropdown = false;
    }
  }

  selectNI(ni) {
    this.selectedNotaIntern = ni;
    this.search = ni.inNo;
    this.showDropdown = false;
  }

  async searchAction() {
    if (this.selectedNotaIntern) {
      // Langsung jalankan pencarian tanpa alert
      const response = await this.service.getById(this.selectedNotaIntern.Id);
      let detail = response.data || response || {};
      // Flatten invoice fields from items[0].garmentInvoice
      const item = (detail.items && detail.items[0]) ? detail.items[0] : {};
      const invoice = item.garmentInvoice || {};
      detail.invoiceNo = invoice.invoiceNo || '';
      detail.invoiceDate = invoice.invoiceDate || '';
      detail.totalAmount = invoice.totalAmount || '';
      // Pastikan semua field yang dibutuhkan di tabel terisi
      detail.inNo = detail.inNo || this.selectedNotaIntern.inNo || '';
      detail.inDate = detail.inDate || this.selectedNotaIntern.inDate || '';
      detail.currencyCode = (detail.currency && detail.currency.Code) ? detail.currency.Code : (detail.currencyCode || '');
      detail.supplierName = (detail.supplier && detail.supplier.Name) ? detail.supplier.Name : (detail.supplierName || '');
      detail.remark = detail.remark || '';
      detail.CreatedBy = detail.CreatedBy || '';

      // Inject pOSerialNumber ke setiap detail dari detail, bukan dari item
      if (item.details && Array.isArray(item.details)) {
        item.details = item.details.map(d => ({
          ...d,
          pOSerialNumber: d.pOSerialNumber || d.poSerialNumber || ''
        }));
      }

      this.selectedViewData = [detail];
      // Trigger refresh pada child au-table
      if (window.table && typeof window.table.refresh === 'function') {
        window.table.refresh();
      }
    } else {
      this.selectedViewData = [];
    }
  }

  clearAction() {
    // Reset semua data pencarian
    this.search = '';
    this.searchResults = [];
    this.showDropdown = false;
    this.selectedNotaIntern = null;
    this.selectedViewData = [];
    this.loading = false;

    // Reset hasil scan dan file PDF
    this.clearScanData();

    // Trigger refresh pada child au-table
    if (window.table && typeof window.table.refresh === 'function') {
      window.table.refresh();
    }
  }
}
