import { inject, customElement } from 'aurelia-framework';
import { Service } from '../service';
import { Router } from 'aurelia-router';

@customElement('compare-doc-ai')
@inject(Service, Router)
export class CompareDocAi {
  constructor(service, router) {
    this.service = service;
    this.router = router;
    // Upload PDF logic
    this.file = null;
    this.uploading = false;
    this.uploadError = '';
    this.isScanning = false; // loader scanning
    this.pdfUploaderComponent = null; // Reference ke pdfuploader-data component
  }

  // ...existing code...

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
      // Tidak langsung scan, hanya simpan file
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
    this.isScanning = true;
    try {
      const result = await this.service.uploadScanInvoiceExternal(this.file);
      this.uploading = false;
      this.isScanning = false;
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
      this.isScanning = false;
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
    if (!this.selectedNotaIntern) {
      this.selectedViewData = [];
      this.selectedNotaInternDetail = null;
      return;
    }

    // Ambil garmentInvoiceId dari hasil search (internal note list)
    const firstItem = (this.selectedNotaIntern.items && this.selectedNotaIntern.items[0]) ? this.selectedNotaIntern.items[0] : null;
    const garmentInvoice = firstItem && firstItem.garmentInvoice ? firstItem.garmentInvoice : null;
    if (!garmentInvoice || !garmentInvoice.Id) {
      alert('Garment Invoice tidak ditemukan pada Nota Intern yang dipilih');
      return;
    }

    try {
      // Sekarang memanggil endpoint invoice (getInternNoteById sudah diarahkan ke garment-invoices)
      const response = await this.service.getInternNoteById(garmentInvoice.Id);
      const internNoteCalculation = await this.service.getInternNoteCalculationById(this.selectedNotaIntern.Id);
      const invoiceDetail = response.data || response || {};

      // Bentuk objek gabungan untuk kebutuhan tabel (prioritas tampil invoice terlebih dahulu)
      const merged = {
        // Field dari Nota Intern (fallback agar kolom tidak kosong)
        inNo: invoiceDetail.internNoteNo || this.selectedNotaIntern.inNo || '',
        inDate: this.selectedNotaIntern.inDate || '',
        supplierName: (this.selectedNotaIntern.supplier && this.selectedNotaIntern.supplier.Name) ? this.selectedNotaIntern.supplier.Name : '',
        CreatedBy: this.selectedNotaIntern.CreatedBy || invoiceDetail.CreatedBy || '',
        // Field invoice
        invoiceNo: invoiceDetail.invoiceNo || invoiceDetail.InvoiceNo || garmentInvoice.invoiceNo || '',
        invoiceDate: invoiceDetail.invoiceDate || invoiceDetail.InvoiceDate || '',
        totalAmount: internNoteCalculation.totalAmountCalculation || '',
        remark: invoiceDetail.remark || '',
        currencyCode: (invoiceDetail.currency && invoiceDetail.currency.Code) ? invoiceDetail.currency.Code : '',
        // Jenis PPN (vat rate) diambil dari beberapa kemungkinan properti
        vatRate: (function (det) {
          if (det.vatRate != null) return det.vatRate;
          if (det.vat && (det.vat.rate != null)) return det.vat.rate;
          if (det.vat && (det.vat.Rate != null)) return det.vat.Rate;
          if (det.VatRate != null) return det.VatRate;
          return null;
        })(invoiceDetail),
        // Jumlah PPN dihitung (jika tersedia) = totalAmount * (vatRate/100)
        vatAmount: internNoteCalculation.ppnTotalCalculation || '',
        // Simpan kedua ID eksplisit
        garmentInvoiceId: invoiceDetail.Id || garmentInvoice.Id || null,
        garmentInternNoteId: this.selectedNotaIntern.Id || null,
        // Pertahankan Id untuk kompatibilitas lama (pakai invoice Id agar tidak bentrok)
        Id: invoiceDetail.Id || garmentInvoice.Id || this.selectedNotaIntern.Id,
        // Simpan struktur items agar detailFormatter tetap bisa berjalan (gunakan items dari invoice jika ada, fallback ke nota intern)
        items: invoiceDetail.items && invoiceDetail.items.length ? invoiceDetail.items : (this.selectedNotaIntern.items || [])
      };

      // Normalisasi pOSerialNumber di dalam details bila struktur menyerupai sebelumnya
      if (merged.items && merged.items.length) {
        merged.items.forEach(item => {
          if (item.details && Array.isArray(item.details)) {
            item.details = item.details.map(d => {
              // Hitung paymentDueDate jika belum ada (invoiceDate + paymentDueDays)
              let paymentDueDate = d.paymentDueDate;
              if (!paymentDueDate) {
                const baseDateStr = merged.invoiceDate || invoiceDetail.invoiceDate;
                if (baseDateStr && d.paymentDueDays) {
                  const baseDate = new Date(baseDateStr);
                  if (!isNaN(baseDate)) {
                    baseDate.setDate(baseDate.getDate() + d.paymentDueDays);
                    paymentDueDate = baseDate.toISOString();
                  }
                }
              }
              return {
                ...d,
                paymentDueDate, // baru atau existing
                pOSerialNumber: d.pOSerialNumber || d.poSerialNumber || '',
                unit: d.unit ? d.unit : (d.uoms ? { Name: d.uoms.Unit } : undefined), // agar kolom Diterima Unit tidak kosong total
                // Inject deliveryOrder reference agar detailFormatter bisa akses paymentMethod & paymentType
                deliveryOrder: d.deliveryOrder || item.deliveryOrder || undefined,
              };
            });
          }
        });
      }

      this.selectedNotaInternDetail = merged; // Simpan untuk proses lanjut (cek compare)
      this.selectedViewData = [merged];

      if (window.table && typeof window.table.refresh === 'function') {
        window.table.refresh();
      }
    } catch (e) {
      alert('Gagal mengambil data Garment Invoice: ' + (e && e.message ? e.message : e));
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

  // Handler tombol Cek NI dan Invoice External
  cekNiInvoiceExternal() {
    if (!this.selectedNotaInternDetail) {
      alert('Maaf anda harus mencari data terlebih dahulu');
      return;
    }
    const garmentInvoiceId = this.selectedNotaInternDetail.garmentInvoiceId;
    const garmentInternNoteId = this.selectedNotaInternDetail.garmentInternNoteId;
    // console.log('[cekNiInvoiceExternal] Collected IDs', {
    //   garmentInvoiceId,
    //   garmentInternNoteId,
    //   selectedNotaInternDetailId: this.selectedNotaInternDetail.Id,
    //   mergedObject: this.selectedNotaInternDetail
    // });
    if (!garmentInvoiceId) {
      // console.warn('[cekNiInvoiceExternal] garmentInvoiceId missing');
      alert('Maaf data Invoice tidak ditemukan');
      return;
    }
    if (!garmentInternNoteId) {
      // console.warn('[cekNiInvoiceExternal] garmentInternNoteId missing');
      alert('Maaf data Nota Intern tidak ditemukan');
      return;
    }

    // Selalu ambil hasil edit dari pdfUploaderComponent jika ada scannedData
    let postData = {};
    if (this.pdfUploaderComponent && this.scannedData) {
      const editedData = this.pdfUploaderComponent.getEditedJson();
      postData = { scanResult: JSON.stringify(editedData) };
      // console.log('DATA YANG DIKIRIM KE BACKEND:', editedData);
    } else if (this.file) {
      postData = { file: this.file };
    } else {
      alert('Mohon untuk upload file pdf dan melakukan scan file Invoice External terlebih dahulu.');
      return;
    }

    // Loader overlay
    this.isScanning = true;
    this.loaderText = 'Proses pengecekan sedang berjalan...';

    this.service.postCompareInternalNoteInvoiceExternal(garmentInvoiceId, garmentInternNoteId, postData)
      .then(response => {
        this.isScanning = false;
        // Response handling
        if (response && response.statusCode === 200) {
          alert('Pengecekan NI dan Invoice External berhasil, tidak ada perbedaan');
          if (this.router) this.router.navigateToRoute('list');
        } else if (response && response.statusCode === 201) {
          alert('No Nota Intern dan Invoice External Tidak Sesuai');
          if (this.router) this.router.navigateToRoute('list');
        } else {
          const msg = response && response.message ? response.message : 'Terjadi error tidak diketahui';
          alert('Maaf terjadi error karena: ' + msg);
        }
      })
      .catch(err => {
        this.isScanning = false;
        alert('Maaf terjadi error karena: ' + (err && err.message ? err.message : err));
      });
  }
}
