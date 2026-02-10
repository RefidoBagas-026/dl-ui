import { inject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service, LocalService } from "../service";

@inject(Router, Service, LocalService)
export class Upload {
  @bindable dataFormRef;
  @bindable error = {};
  @bindable onResult; // callback optional untuk mengirim hasil ke parent
  formOptions = { label: { length: 3 }, control: { length: 9 } };

  constructor(router, service, localService) {
    this.router = router;
    this.service = service;
    this.localService = localService;
    this.selectedFile = null;
    this.disabled = false;
    this.success = false;
    this.isScanning = false; // for loader overlay
  }

  // Saat dipanggil via <compose model.bind="{ onResult: handleUploadResult }">
  activate(model) {
    if (model && typeof model.onResult === "function") {
      this.onResult = model.onResult;
    }
    if (model && typeof model.onFileSelected === "function") {
      this.onFileSelected = model.onFileSelected;
    }
    this.dataFormRef = model.dataFormRef;
  }

  onFileChanged(evt) {
    this.error = {};
    const file = evt && evt.target && evt.target.files && evt.target.files[0];
    this.selectedFile = file || null;
    if (file && file.type !== "application/pdf") {
      // Some browsers may not set type accurately; keep a light check
      const name = (file.name ? file.name.toLowerCase() : "") || "";
      if (!name.endsWith(".pdf")) {
        this.error.file = "Hanya file PDF yang diperbolehkan";
        this.selectedFile = null;
      }
    }
    if (typeof this.onFileSelected === "function") {
      this.onFileSelected(this.selectedFile);
    }
  }

  cancel() {
    this.router.navigateToRoute("list");
  }

  async upload() {
    console.log("dataFormRef di upload:", this.dataFormRef);
    console.log("SPB di upload:", this.dataFormRef && this.dataFormRef.SPB);

    this.error = {};
    const dataForm = this.dataFormRef;
    let selected = dataForm && dataForm.SPB ? dataForm.SPB : null;

    if (!selected || !(selected.UPONo || selected._id)) {
      alert("Anda harus memilih Nomor Surat Perintah Bayar terlebih dahulu.");
      return;
    }

    if (!this.selectedFile) {
      this.error.file = "File harus dipilih";
      return;
    }

    this.isScanning = true;

    try {
      // const uploadResult = await this.localService.uploadFile(
      const uploadResult = await this.service.uploadFile(
        this.selectedFile,
        selected,
      );
      console.log("Hasil upload file:", uploadResult);
      if (
        uploadResult &&
        uploadResult.data &&
        uploadResult.data.alreadyChecked === true
      ) {
        alert(uploadResult.message);
        this.isScanning = false;
        return;
      }

      alert("Hasil Scan Dokumen Berhasil");

      if (typeof this.onResult === "function") {
        try {
          this.onResult(uploadResult);
        } catch (_) {
          /* noop */
        }
      }

      return uploadResult;
    } catch (e) {
      this.error.upload = e.message || "Gagal upload file";
    } finally {
      this.isScanning = false;
    }
  }

  clear() {
    this.error = {};
    this.success = false;
    this.selectedFile = null;
    // reset elemen file input
    if (this.fileInput) {
      this.fileInput.value = "";
    }
    // beritahu parent untuk mengosongkan hasil
    if (typeof this.onResult === "function") {
      try {
        this.onResult(null);
      } catch (_) {
        /* noop */
      }
    }
    // beritahu parent untuk mengosongkan file yang dipilih
    if (typeof this.onFileSelected === "function") {
      try {
        this.onFileSelected(null);
      } catch (_) {
        /* noop */
      }
    }
  }
}

export default Upload;
