import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from '../service';
import { ServiceCompare } from '../service';

@inject(Service,ServiceCompare, Router)
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
  isCheckingNiPo = false;

  constructor(service,serviceCompare, router) {
    this.service = service;
    this.serviceCompare = serviceCompare;
    this.router = router;
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
    if (!this.selectedData || !this.selectedData.Id) {
      window.alert('Pilih dokumen terlebih dahulu!');
      return;
    }
    this.loading = true;
    try {
      const pdfUrl = await this.service.getPdfBlobById(this.selectedData.Id);
      this.pdfPreviewUrl = pdfUrl;
    } catch (e) {
      window.alert('Gagal menampilkan PDF: ' + (e.message || e));
      this.pdfPreviewUrl = null;
    } finally {
      this.loading = false;
    }
  }

  // Fungsi untuk notifikasi sukses cek NI dan PO
  async cekNiPo() {
    let errorMsg = [];
    if (!this.selectedData || !this.selectedData.Id) {
      errorMsg.push('Pilih dokumen pada pencarian dokumen!');
    }
    const files = this.uploadFiles.filter(f => f);
    if (files.length === 0) {
      errorMsg.push('Upload minimal 1 file PDF!');
    }
    if (errorMsg.length > 0) {
      window.alert(errorMsg.join('\n'));
      return;
    }
    this.loading = true;
    this.isCheckingNiPo = true;
    try {
      const response = await this.serviceCompare.endpoint.client.fetch(
        `garment-purchasing-expeditions/compare-internal-note-purchase-order-external?garmentInternNoteId=${this.selectedData.Id}`,
        {
          method: 'POST',
          headers: new Headers({
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }),
          body: (() => {
            const formData = new FormData();
            files.forEach(f => formData.append('files', f));
            return formData;
          })()
        }
      );
      if (response.status === 201) {
        const revisionResult = await this.serviceCompare.getInternNoteRevision();
        window.alert('Data revision berhasil diambil.');
        sessionStorage.setItem('hideTable', 'false');
        sessionStorage.setItem('showRevision', '1');
        sessionStorage.setItem('selectedPage', '1');
        this.router.navigateToRoute('view');
      } else if (response.status === 200) {
        window.alert('Comparison success, but the result is already up to date.');
      } else {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Unknown error');
      }
    } catch (e) {
      window.alert('Failed to compare NI and PO: ' + (e.message || e));
    } finally {
      this.loading = false;
      this.isCheckingNiPo = false;
    }
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
