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
    console.log('printPdf dipanggil', this.selectedData);
    if (this.selectedData && this.selectedData.Id) {
      this.loading = true;
      try {
        // Download PDF langsung seperti cetak PDF di modul lain
        await this.service.getPdfById(this.selectedData.Id);
        // Tidak perlu blob, langsung trigger download dari response backend
        this.pdfPreviewUrl = null;
      } catch (err) {
        console.error('Gagal fetch PDF:', err.response && err.response.status, err.message);
        alert('Gagal mengambil PDF. Pastikan Anda sudah login dan punya akses.');
      } finally {
        this.loading = false;
      }
    } else {
      console.warn('printPdf: selectedData atau Id tidak ada', this.selectedData);
    }
  }
}
