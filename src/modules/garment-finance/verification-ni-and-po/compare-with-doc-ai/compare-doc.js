import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from '../service';
import { ServiceCompare } from '../service';
import { Dialog } from '../../../../components/dialog/dialog';
import { POScanResultDialog } from '../dialog/po-scan-result-dialog';

@inject(Dialog, Service, ServiceCompare, Router)
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
  isScanningPO = false;

  constructor(dialog, service, serviceCompare, router) {
    this.dialog = dialog;
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
    if (this.uploadFiles.length === 0) {
      errorMsg.push('Upload minimal 1 file PDF!');
    }
    if (errorMsg.length > 0) {
      window.alert(errorMsg.join('\n'));
      return;
    }
    this.loading = true;
    this.isCheckingNiPo = true;
    try {
      // Prepare FormData
      const formData = new FormData();
      // Collect all scannedData and files into arrays
      const scanResultsArr = [];
      const filesArr = [];
      for (let i = 0; i < this.uploadFiles.length; i++) {
        const upload = this.uploadFiles[i];
        if (!upload) continue;
        if (upload.scannedData) {
          scanResultsArr.push(upload.scannedData);
        } else if (upload.file) {
          filesArr.push(upload.file);
        }
      }
      // Append as collections
      if (scanResultsArr.length > 0) {
        formData.append('ScanResults', JSON.stringify(scanResultsArr));
      }
      if (filesArr.length > 0) {
        for (let i = 0; i < filesArr.length; i++) {
          formData.append('Files', filesArr[i]);
        }
      }
      // Do NOT add InternNoteId to FormData, use as query param
      const endpoint = `garment-purchasing-expeditions/compare-internal-note-purchase-order-external?garmentInternNoteId=${encodeURIComponent(this.selectedData.Id)}`;
      const request = {
        method: 'POST',
        headers: new Headers({
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }),
        body: formData
      };
      const response = await this.serviceCompare.endpoint.client.fetch(endpoint, request);
      if (response.status === 201) {
        window.alert(' Pengecekan NI dan PO berhasil, ada perbedaan.');
        sessionStorage.setItem('hideTable', 'false');
        sessionStorage.setItem('showRevision', '1');
        sessionStorage.setItem('selectedPage', '1');
        this.router.navigateToRoute('view');
      } else if (response.status === 200) {
        window.alert('Pengecekan NI dan PO berhasil, tidak ada perbedaan.');
      } else {
        const result = await response.json().catch(() => ({}));
        /* Check for Backend ResultFormatter error structure
            * If the error is an object, extract the first key's value
            * This is to handle cases where the backend returns a structured error
            * like { "error": { "message": "..." } } or { "error": "Some error message" }
        */
        if (result && result.error && typeof result.error === 'object' && result.error !== null) {
          const firstKey = Object.keys(result.error)[0];
          throw new Error(result.error[firstKey]);
        }
        // Fallback for plain error message
        throw new Error(result || 'Unknown error');
      }
    } catch (e) {
      window.alert('Gagal, ' + (e.message || e));
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
    this.uploadFiles[index] = { file: file, scannedData: null };
    this.uploadFileNames[index] = file.name;
    this.uploadErrors[index] = "";
  }

  scanUploadFile(index) {
    if (!this.uploadFiles[index]) {
      alert("Tidak ada file yang diupload");
      return;
    }

    const { file, scannedData } = this.uploadFiles[index];

    if (scannedData) {
      // If already scanned, just show the dialog with the cached result
      this.dialog.show(POScanResultDialog, scannedData);
      return;
    }

    // Not yet scanned, call the API and show dialog after result is ready
    this.isScanningPO = true;
    this.loading = true;

    var formData = new FormData();
    formData.append("file", file);
    var endpoint = 'garment-intern-notes-revision/scan-external-purchase-order';
    var request = {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }),
      body: formData
    };
    this.serviceCompare.endpoint.client.fetch(endpoint, request)
      .then(response => {
        this.isScanningPO = false;
        this.loading = false;
        if (response.status == 200) {
          // Parse the response as JSON to get the scanned data
          return response.json();
        } else if (response.status == 400) {
          alert("Only PDF files are allowed.");
        } else if (response.status == 500) {
          alert("Scan failed. Please try again.");
        }
      })
      .then(data => {
        if (data) {
          // Save the scanned data so we don't scan again
          this.uploadFiles[index] = { file, scannedData: data.data };
          this.dialog.show(POScanResultDialog, data.data);
        }
      });
  }
}
