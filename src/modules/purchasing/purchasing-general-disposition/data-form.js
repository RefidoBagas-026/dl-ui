import {
  inject,
  bindable,
  containerless,
  computedFrom,
  BindingEngine,
  TaskQueue,
} from "aurelia-framework";
import { Service } from "./service";
import { AuthService } from "aurelia-authentication";
var UnitLoader = require('../../../loader/unit-loader');
import moment from "moment";

@inject(Service, BindingEngine, AuthService, TaskQueue)
export class DataForm {
  @bindable readOnly = false;
  @bindable data = {};
  @bindable error = {};
  @bindable title;
  @bindable options = {};
  @bindable unitDeliveryOrder;
  @bindable unit;
  @bindable TypeDisposition;

  selectedSupplier = null;
  dispositionTypes = [" ","Disposisi Baru", "Disposisi Kenaikan Harga"];
  controlOptions = {
    label: {
      align: "right",
      length: 5,
    },
    control: {
      length: 5,
      align: "right",
    },
  };

  constructor(service, bindingEngine, authService, taskQueue) {
    this.service = service;
    this.bindingEngine = bindingEngine;
    this.authService = authService;
    this.previewWidth = 60;
    this.previewHeight = 600;
    this.taskQueue = taskQueue;
    this._itemSubscriptions = new Map();
  }

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error || {};
    this.isItem = false;
    this.isEdit = this.data.Id ? true : false;

    if (!this.data.Items) {
      this.data.Items = [];
    }
    if (!this.error.Items) {
      this.error.Items = [];
    }
    if (this.data.Items && this.data.Items.length > 0) {
      this.isItem = true;
    }

    this.options.readOnly = this.readOnly;
    this.options.isEdit = this.isEdit;

    this.readOnlySender = true;
   
    this.TypeDisposition = this.data.TypeDisposition || "";
    this.isItem = !!this.TypeDisposition;
    this.data.DocumentsFile = this.data.DocumentsFile || [];
    this.data.DocumentsFileName = this.data.DocumentsFileName || [];
    this.documentsPathTemp = [].concat(this.data.DocumentsPath);
  
  }

ItemsNewDisposition = {
    columns: [
          "Kode Barang",
          "Nama Barang",
          "Satuan",
          "Mata Uang",
          "Harga Satuan",
          "Nama Supplier 1",
          "Harga Supplier 1",
          "Nama Supplier 2",
          "Harga Supplier 2", 
          "Nama Supplier 3",
          "Harga Supplier 3",
        ],
        onAdd: function () {
          this.data.Items.push({
            ProductCode: null,
            ProductName: null,
            Uom: null,
            ProductCurrency: null,
            ProductPrice: 0,
            Supplier1Name: null,
            Supplier1Price: 0,
            Supplier2Name: null,
            Supplier2Price: 0,
            Supplier3Name: null,
            Supplier3Price: 0,
            IsNew: true
          }); 
          this.data.Items.forEach((m, i) => m.itemindex = i);
        }.bind(this),
        onRemove: function () {
          this.data.Items.forEach((m, i) => (m.itemindex = i));
        }.bind(this),
        options: {
          options: this.options,
        },
  };

  ItemsPriceIncreaseDisposition = {
    columns: [
        "Kode Barang",
        "Nama Barang Lama",     
        "Satuan Lama", 
        "Mata Uang",
        "Tanggal Terakhir Beli",
        "Harga Terakhir Beli",
        "Harga Master",
        "Harga Update",
        "Selisih Harga",
        "Persentase",
        "Nama Supplier 1",
        "Harga Supplier 1",
        "Nama Supplier 2",
        "Harga Supplier 2", 
        "Nama Supplier 3",
        "Harga Supplier 3",        
    ],
    onAdd: function () {
      this.data.Items.push({
        ProductCode: null,
        ProductName: null,
        Uom: null,
        ProductCurrency: null,
        LastPurchaseDate: null,
        LastPurchasePrice: 0,
        ProductPrice: 0,
        UpdatePrice: 0,
        PriceDifference: 0,
        Percentage: 0,
        Supplier1Name: null,
        Supplier1Price: 0,
        Supplier2Name: null,
        Supplier2Price: 0,
        Supplier3Name: null,
        Supplier3Price: 0,
        IsNew: true,

      });
      this.data.Items.forEach((m, i) => m.itemindex = i);
    }.bind(this),
    onRemove: function () {
      this.data.Items.forEach((m, i) => (m.itemindex = i));
    }.bind(this),
    options: {
      options: this.options,
    },
  };   

  dispositionTypeChanged(event) {
  this.data.TypeDisposition = this.TypeDisposition;
  
  // Set isItem false dulu untuk destroy collection
  this.isItem = false;
  
  // Pastikan error ada
  if (!this.error) {
    this.error = {};
  }
  
  // Reset error.Items DULU sebelum splice data.Items
  if (this.error.Items && Array.isArray(this.error.Items)) {
    this.error.Items.splice(0);
  } else {
    this.error.Items = [];
  }
  
  this.data.Items.splice(0);
  
  // Reset semua property error menjadi null/kosong
  Object.keys(this.error).forEach(key => {
    if (key !== 'Items') {
      delete this.error[key];
    }
  });
  
  // Reset juga context.error agar binding tetap sinkron
  if (this.context && this.context.error) {
    if (this.context.error.Items && Array.isArray(this.context.error.Items)) {
      this.context.error.Items.splice(0);
    }
    Object.keys(this.context.error).forEach(key => {
      if (key !== 'Items') {
        delete this.context.error[key];
      }
    });
  }
  
  this.resetDocuments();
  
  // Re-enable collection setelah reset
  this.taskQueue.queueMicroTask(() => {
    this.isItem = !!this.TypeDisposition;
  });
}

 resetDocuments() {
    this.data.DocumentsFile = [];
    this.data.DocumentsFileName = [];
    this.documentsPathTemp = [];

    if (this.error) {
      this.error.DocumentsFile = [];
    }

    this.taskQueue.queueMicroTask(() => {
      document
        .querySelectorAll('input[type="file"]')
        .forEach(i => (i.value = null));
    });
  }


  calculateTotalPrice(item) {
    if (this.TypeDisposition === "Disposisi Kenaikan Harga") {
      var master = Number(item.ProductPrice) || 0;
      var update = Number(item.UpdatePrice) || 0;
      var diff = update - master;

      item.PriceDifference = diff;

      item.Percentage = master !== 0
        ? (diff / master) * 100
        : 0;
    }
  }

  onAddDocument() {
      this.data.DocumentsFile.push("");
      this.data.DocumentsFileName.push("");
      this.documentsPathTemp.push("");
      
      if (!this.error.DocumentsFile) {
          this.error.DocumentsFile = [];
      }
      this.error.DocumentsFile.push("");
  }

  onRemoveDocument(index) {
      this.data.DocumentsFile.splice(index, 1);
      this.data.DocumentsFileName.splice(index, 1);
      this.documentsPathTemp.splice(index, 1);
      
    
      if (this.error.DocumentsFile && this.error.DocumentsFile.length > index) {
          this.error.DocumentsFile.splice(index, 1);
      }
  }

  downloadDocument(index) {
      const linkSource = this.data.DocumentsFile[index];
      const downloadLink = document.createElement("a");
      const fileName = this.data.DocumentsFileName[index];

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
  }

  documentInputChanged(index) {
      let documentInput = document.getElementById('documentInput' + index);

      if (documentInput.files[0]) {
          let reader = new FileReader();
          reader.onload = event => {
              let base64Document = event.target.result;
              const base64Content = base64Document.substring(base64Document.indexOf(',') + 1);
              if (base64Content.length * 6 / 8 > 52428800) {
                  documentInput.value = "";
                  this.data.DocumentsFile[index] = "";
                  this.data.DocumentsFileName[index] = "";
                  alert("Maximum Document Size is 50 MB")
              } else {
                  this.data.DocumentsFile[index] = base64Document;
                  this.data.DocumentsFileName[index] = documentInput.value.replace(/^.*[\\\/]/, '');
                  
                  if (this.error.DocumentsFile && this.error.DocumentsFile[index]) {
                      this.error.DocumentsFile[index] = "";
                  }
              }
          }
          reader.readAsDataURL(documentInput.files[0]);
      }
  }

  validateDocuments() {
      let isValid = true;
      
     
      if (!this.error.DocumentsFile) {
          this.error.DocumentsFile = [];
      }
      
      if (this.data.DocumentsFileName && this.data.DocumentsFileName.length > 0) {
          for (let i = 0; i < this.data.DocumentsFileName.length; i++) {
          
              if (!this.data.DocumentsFile[i] || this.data.DocumentsFile[i] === "") {
           
                  if (!this.documentsPathTemp[i] || this.documentsPathTemp[i] === "") {
                      this.error.DocumentsFile[i] = "File harus di-upload";
                      isValid = false;
                  }
              } else {
                  
                  this.error.DocumentsFile[i] = "";
              }
          }
      }
      
      return isValid;
  }

  //atur review dan ukuran pop up
  updatePreviewSize() {
          const modalDialog = document.querySelector('#pdfPreviewModal .modal-dialog');
          const embed = document.getElementById('pdfEmbed');
          const excelDiv = document.getElementById('excelTable');
          const imagePreview = document.getElementById('imagePreview');
          
          if (modalDialog) {
              modalDialog.style.width = `${this.previewWidth}%`;
              modalDialog.style.maxWidth = `${this.previewWidth}%`;
          }
          if (embed) {
              embed.style.height = `${this.previewHeight}px`;
          }
          if (excelDiv) {
              excelDiv.style.maxHeight = `${this.previewHeight}px`;
          }
          if (imagePreview) {
              imagePreview.style.maxHeight = `${this.previewHeight}px`;
          }
      }
  
      initResizable() {
          const modal = document.getElementById('pdfPreviewModal');
          if (!modal) return;
          const handles = modal.querySelectorAll('.resize-handle');         
          handles.forEach(handle => {
              handle.addEventListener('mousedown', (e) => {
                  e.preventDefault();
                  this.isResizing = true;
                  this.resizeDirection = handle.dataset.direction;
                  this.startX = e.clientX;
                  this.startY = e.clientY;
                  
                  const modalDialog = modal.querySelector('.modal-dialog');
                  const rect = modalDialog.getBoundingClientRect();
                  this.startWidth = rect.width;
                  this.startHeight = this.previewHeight;
                
                  document.addEventListener('mousemove', this.handleResize);
                  document.addEventListener('mouseup', this.stopResize);
                  
                  modalDialog.style.transition = 'none';
              });
          });
      }
  
      handleResize = (e) => {
          if (!this.isResizing) return;
          
          const deltaX = e.clientX - this.startX;
          const deltaY = e.clientY - this.startY;
          const modalDialog = document.querySelector('#pdfPreviewModal .modal-dialog');
          
          if (this.resizeDirection.includes('e')) {
              const newWidth = this.startWidth + deltaX;
              const windowWidth = window.innerWidth;
              const widthPercent = Math.max(30, Math.min(100, (newWidth / windowWidth) * 100));
              this.previewWidth = Math.round(widthPercent);
          }
          
          if (this.resizeDirection.includes('w')) {
              const newWidth = this.startWidth - deltaX;
              const windowWidth = window.innerWidth;
              const widthPercent = Math.max(30, Math.min(100, (newWidth / windowWidth) * 100));
              this.previewWidth = Math.round(widthPercent);
          }
          
          if (this.resizeDirection.includes('s')) {
              const newHeight = this.startHeight + deltaY;
              this.previewHeight = Math.max(300, Math.min(1000, Math.round(newHeight)));
          }
          
          if (this.resizeDirection.includes('n')) {
              const newHeight = this.startHeight - deltaY;
              this.previewHeight = Math.max(300, Math.min(1000, Math.round(newHeight)));
          }
          
          this.updatePreviewSize();
      }
  
      stopResize = () => {
          if (this.isResizing) {
              this.isResizing = false;
              this.resizeDirection = null;
              
              const modalDialog = document.querySelector('#pdfPreviewModal .modal-dialog');
              if (modalDialog) {
                  modalDialog.style.transition = '';
              }
              
              document.removeEventListener('mousemove', this.handleResize);
              document.removeEventListener('mouseup', this.stopResize);
          }
      }
  
      previewDocument(index) {
          const fileUrl = this.data.DocumentsFile[index];
          const fileName = this.data.DocumentsFileName[index];
          const embed = document.getElementById('pdfEmbed');
          const excelDiv = document.getElementById('excelTable');
          const imagePreview = document.getElementById('imagePreview');
          const modalLabel = document.getElementById('previewModalLabel');
  
          const lowerFileName = fileName.toLowerCase();
          if (lowerFileName.endsWith('.pdf')) {
              modalLabel.innerText = 'Preview PDF';
              embed.src = fileUrl;
              embed.style.display = 'block';
              excelDiv.style.display = 'none';
              imagePreview.style.display = 'none';
              this.updatePreviewSize();
              $('#pdfPreviewModal').modal('show');
              setTimeout(() => this.initResizable(), 100);
          } else if (lowerFileName.endsWith('.xlsx') || lowerFileName.endsWith('.xls')) {
              modalLabel.innerText = 'Preview Excel';
              embed.style.display = 'none';
              excelDiv.style.display = 'block';
              imagePreview.style.display = 'none';
              excelDiv.innerHTML = '<p>Loading Excel...</p>';
  
              fetch(fileUrl)
                  .then(response => response.arrayBuffer())
                  .then(data => {
                      const workbook = XLSX.read(data, { type: 'array' });
                      const sheetName = workbook.SheetNames[0];
                      const worksheet = workbook.Sheets[sheetName];
                      const html = XLSX.utils.sheet_to_html(worksheet);
                      excelDiv.innerHTML = html;
                  })
                  .catch(error => {
                      excelDiv.innerHTML = '<p>Error loading Excel file.</p>';
                      console.error('Error fetching or parsing Excel:', error);
                  });
  
              this.updatePreviewSize();
              $('#pdfPreviewModal').modal('show');
              setTimeout(() => this.initResizable(), 100);
          } else if (lowerFileName.endsWith('.jpg') || lowerFileName.endsWith('.jpeg') || lowerFileName.endsWith('.png') || lowerFileName.endsWith('.gif') || lowerFileName.endsWith('.bmp') || lowerFileName.endsWith('.webp')) {
              modalLabel.innerText = 'Preview Image';
              imagePreview.src = fileUrl;
              embed.style.display = 'none';
              excelDiv.style.display = 'none';
              imagePreview.style.display = 'block';
              this.updatePreviewSize();
              $('#pdfPreviewModal').modal('show');
              setTimeout(() => this.initResizable(), 100);
          } else {
              alert('Preview not supported for this file type.');
          }
      }
}

