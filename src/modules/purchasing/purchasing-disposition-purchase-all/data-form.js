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

  dispositionTypes = ["Disposisi Pembelian"];

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
    this.error = this.context.error;
    this.isItem = false;
    this.isEdit = this.data.Id ? true : false;

    if (!this.data.items) {
      this.data.items = [];
    }
    if (this.data.items)
    if (this.data.items && this.data.items.length > 0) {
      this.isItem = true;
    }
    if (this.data.items && this.data.items.length > 0) {
      for (let it of this.data.items) {
        this.subscribeItem(it);
      }
    }
    this.options.readOnly = this.readOnly;
    this.options.isEdit = this.isEdit;
    this.options.add = () => {
      this.addItems();
    };

    this.options.calculateTotalPrice = (item) => {
      this.calculateTotalPrice(item);
    };

    this.options.remove = (item) => {
      if (!this.data.items) return;
      this.unsubscribeItem(item);
      var index = this.data.items.indexOf(item);
      if (index > -1) this.data.items.splice(index, 1);
    };

    this.readOnlySender = true;
   
    this.TypeDisposition = this.data.TypeDisposition || "Disposisi Pembelian";
    this.data.TypeDisposition = this.TypeDisposition;
    this.isItem = !!this.TypeDisposition;
     this.data.DocumentsFile = this.data.DocumentsFile || [];
    this.data.DocumentsFileName = this.data.DocumentsFileName || [];
    this.documentsPathTemp = [].concat(this.data.DocumentsPath);
  
  
  }

  addItems() {
    if (!this.data.items) {
      this.data.items = [];
    }
    var item = { 
      TotalPrice: 0,
      ProductPrice : 0,
      PriceDifference: 0,
      Percentage: 0,
      IsNew: true
    };
    this.data.items.push(item);
    this.subscribeItem(item);
  }

  disposeSubscription(sub) {
    try {
      if (sub && typeof sub.dispose === 'function') sub.dispose();
      else if (typeof sub === 'function') sub();
    } catch (e) {}
  }

  observe(item, prop) {
  try {
    return this.bindingEngine
      .propertyObserver(item, prop)
      .subscribe(() => this.calculateTotalPrice(item));
  } catch (e) {
    return null;
  }
}

  subscribeItem(item) {
  if (!item) return;

  const subs = [
    this.observe(item, 'quantity'),
    this.observe(item, 'product.price'),
 
  ].filter(Boolean);

  this._itemSubscriptions.set(item, subs);
  this.calculateTotalPrice(item);
}

  unsubscribeItem(item) {
    const subs = this._itemSubscriptions.get(item) || [];
    subs.forEach(s => this.disposeSubscription(s));
    this._itemSubscriptions.delete(item);
  }

  get items() {
    return { 
      columns: [
        "Supplier",
        "Nama Barang",
        "Brand",
        "Description",
        "Mata Uang",
        "Jumlah Barang",
        "Satuan",
        "Harga Satuan",
        "Harga Total",
      ] 
    };
  }

  dispositionTypeChanged(event) {
    this.data.TypeDisposition = this.TypeDisposition;
    this.isItem = !!this.TypeDisposition;

    if (this._itemSubscriptions) {
      for (const subs of this._itemSubscriptions.values()) {
        subs.forEach(s => this.disposeSubscription(s));
      }
      this._itemSubscriptions.clear();
    }
    
    if (!this.data.items) {
      this.data.items = [];
    } else {
      this.data.items.length = 0;
    }
    
    if (this.error) {
      this.error.items = [];
    }
  }


  calculateTotalPrice(item) {
    var qty = Number(item.quantity) || 0;
    var price = item.product ? Number(item.product.price) || 0 : 0;
    item.totalPrice = qty * price;
  }

  downloadDocument(index) {
      const linkSource = this.data.DocumentsFile[index];
      const downloadLink = document.createElement("a");
      const fileName = this.data.DocumentsFileName[index];

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
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

  unbind() {
      this.disposeSubscription(this.expenditureDateSubscription);

      if (!this._itemSubscriptions) return;

      for (const subs of this._itemSubscriptions.values()) {
        subs.forEach(s => this.disposeSubscription(s));
      }

      this._itemSubscriptions.clear();
    }

}

