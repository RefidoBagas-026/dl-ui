import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ServiceCompare } from '../service';

@inject(Router, ServiceCompare)
export class MainPage {
  hasCancel = true;
  hasSave = true;

  constructor(router, serviceCompare) {
    this.router = router;
    this.serviceCompare = serviceCompare;
  }

  bind() {
    this.data = { PurchaseOrder: [] };
    this.error = {};
  }

  // You can add logic here if needed
  cancel(event) {
    var r = confirm("Apakah anda yakin akan keluar?")
    if (r == true) {
      this.router.navigateToRoute('view');
    }
  }

  scanFile(event) {
    var formData = new FormData();
    var fileInput = document.getElementById('pdf-upload');
    var fileList = fileInput.files;
    formData.append("file", fileList[0]);

    var endpoint = 'garment-intern-notes-revision/scan-external-purchase-order';
    var request = {
      method: 'POST',
      headers: {
      },
      body: formData
    };

    var promise = this.serviceCompare.endpoint.client.fetch(endpoint, request);
    this.serviceCompare.publish(promise);

    return promise
      .then(response => {
        return response.json().then(result => {
          if (response.status == 200) {
            var currentData = this.data;
            currentData.PurchaseOrder.splice(0, currentData.PurchaseOrder.length);
            currentData.PurchaseOrder.push(...result.data);
            this.data = currentData;
            this.serviceCompare.publish(promise);
            alert("Scan berhasil!");
          } else if (response.status == 400) {
            this.serviceCompare.publish(promise);
            alert(result);
          }
        });
      })
      .catch(e => {
        this.serviceCompare.publish(promise);
        alert(e);
      });
  }

  save(event) {
    if (!this.data || !this.data.internalNote || !this.data.internalNote.Id) {
      this.error.internalNote = "No Nota Intern harus diisi";
    }

    if ((!this.data || !this.data.purchaseOrderFile) && (this.data.PurchaseOrder.length === 0)) {
      this.error.uploadError = 'File PDF harus diupload';
    }

    if ((this.error.internalNote && this.error.internalNote.trim() !== "") ||
      (this.error.uploadError && this.error.uploadError.trim() !== "")) {
      alert("Mohon melengkapi data yang diperlukan");
      return;
    }

    var formData = new FormData();
    if (this.data.PurchaseOrder.length > 0) {
      formData.append("ScanResults", JSON.stringify(this.data.PurchaseOrder));
    } else {
      var fileInput = document.getElementById('pdf-upload');
      var fileList = fileInput.files;
      formData.append("File", fileList[0]);
    }

    var endpoint = `garment-purchasing-expeditions/compare-internal-note-purchase-order-external?garmentInternNoteId=${this.data.internalNote.Id}`;
    var request = {
      method: 'POST',
      headers: {
      },
      body: formData
    };

    var promise = this.serviceCompare.endpoint.client.fetch(endpoint, request);
    this.serviceCompare.publish(promise);

    return promise
      .then(response => {
        return response.json().then(result => {
          if (response.status == 200) {
            this.serviceCompare.publish(promise);
            alert("Pengecekan NI dan PO berhasil, tidak ada perbedaan.")
          } else if (response.status == 201) {
            this.serviceCompare.publish(promise);
            alert("Pengecekan NI dan PO berhasil, ada perbedaan.");
            this.router.navigateToRoute('view');
          } else if (response.status == 400) {
            var errorMessage = "";

            if (typeof result == "string") {
              errorMessage = result;
            } else if (typeof result == "object" && result.error) {
              var error = result.error;
              Object.keys(error).forEach((e) => {
                if (e && typeof error[e] == "string") {
                  errorMessage += `${error[e]}\n`;
                } else {
                  Object.keys(error[e]).forEach((f) => {
                    Object.keys(error[e][f]).forEach((g) => {
                      errorMessage += `${error[e][f][g]}\n`;
                    });
                  });
                }
              });
            }

            this.serviceCompare.publish(promise);
            alert(errorMessage);
          }
        });
      })
      .catch(e => {
        this.serviceCompare.publish(promise);
        alert(e);
      })
      .finally(() => {
        this.error = {};
      });

  }
}
