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
    console.log("Scan file logic goes here");
    console.log(this.data);
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
        console.log(response);
        return response.json().then(result => {
          console.log(result);
          if (response.status == 200) {
            var currentData = this.data;
            currentData.PurchaseOrder.splice(0, currentData.PurchaseOrder.length);
            currentData.PurchaseOrder.push(...result.data);
            this.data = currentData;
            this.serviceCompare.publish(promise);
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
    console.log(this.data);
  }
}
