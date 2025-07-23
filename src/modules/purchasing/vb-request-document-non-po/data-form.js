import { inject, bindable, computedFrom,  containerless  } from 'aurelia-framework';
import { Service } from './service';
import moment from 'moment';

const CurrencyLoader = require('../../../loader/currency-in-garment-currency-loader');
const UnitVBNonPO = require('../../../loader/unit-vb-non-po-loader');
const UnitLoader = require('../../../loader/unit-loader');
@containerless()
@inject(Service)
export class DataForm {
  @bindable title;
  @bindable readOnly;

  formOptions = {
    cancelText: "Kembali",
    saveText: "Simpan",
    deleteText: "Hapus",
    editText: "Ubah",
  };

  controlOptions = {
    label: {
      length: 4,
    },
    control: {
      length: 4,
    },
  };

  controlOptionsLabel = {
    label: {
      length: 8
    },
    control: {
      length: 3
    }
  }

  controlOptionsDetail = {
    control: {
      length: 10
    }
  }

  cards = [];

  constructor(service) {
    this.service = service;
  }

  @computedFrom("data.Id")
  get isEdit() {
    return (this.data.Id || '').toString() != '';
  }

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;

    this.cancelCallback = this.context.cancelCallback;
    this.deleteCallback = this.context.deleteCallback;
    this.editCallback = this.context.editCallback;
    this.saveCallback = this.context.saveCallback;
    this.hasPosting = this.context.hasPosting;

    if (this.data.Items) {
      var uCosts=[];
      for(var item of this.data.Items){
          if(item.IsSelected){
              uCosts.push(item);
          }
      }
      this.data.Items=uCosts;
    }
    // if (this.data.Items) {
    //   var otherUnit = this.data.Items.find(s => s.Unit.VBDocumentLayoutOrder == 10);
    //   if (otherUnit) {
    //     this.cardContentUnit = otherUnit.Unit;
    //   }
    // }

    // let tempCards = [];
    // this.data.Items.forEach((item, index) => {
    //   tempCards.push(item);
    //   if (item.Unit.VBDocumentLayoutOrder % 5 == 0) {
    //     this.cards.push(tempCards);
    //     tempCards = [];
    //   }
    // });

    // if (tempCards.length > 0) {
    //   this.cards.push(tempCards)
    // }
    this.data.DocumentsFile = this.data.DocumentsFile || [];
      this.data.DocumentsFileName = this.data.DocumentsFileName || [];
      this.documentsPathTemp = [].concat(this.data.DocumentsPath);

  }

  get currencyLoader() {
    return CurrencyLoader;
  }

  unitQuery = { VBDocumentLayoutOrder: 0 }
  get unitVBNonPOLoader() {
    return UnitVBNonPO;
  }

  // otherUnitSelected(event, data) {
  //   this.cardContentUnit = null;
  //   data.Unit = {};
  //   data.Unit.VBDocumentLayoutOrder = 10;
  //   // if (data.IsSelected) {
  //   //   data.Unit.VBDocumentLayoutOrder = 10;
  //   // } else {
  //   //   data.Unit = {};
  //   //   data.Unit.VBDocumentLayoutOrder = 10;
  //   // }
  // }

  unitView = (unit) => {
    return `${unit.Code} - ${unit.Name}`;
  }

  currencyView = (currency) => {
    return `${currency.Code}`;
  }

  get unitLoader() {
    return UnitLoader;
  }
  get unitsQuery(){
    var result = { "Active" : true }
    return result;   
  }


  // @bindable cardContentUnit;
  // cardContentUnitChanged(n, o) {
  //   var otherUnit = this.data.Items.find(s => s.Unit.VBDocumentLayoutOrder == 10);

  //   if (this.cardContentUnit && otherUnit && otherUnit.IsSelected) {
  //     otherUnit.Unit = this.cardContentUnit;
  //     otherUnit.Unit.VBDocumentLayoutOrder = 10;
  //   } else {
  //     if (otherUnit) {
  //       otherUnit.Unit = {};
  //       otherUnit.Unit.VBDocumentLayoutOrder = 10;
  //     }
  //   }
  // }

  itemColumns = [
    "Unit",
  ];

  get addItems() {
    return (event) => {
        this.data.Items.push({ });
    };
  }

  onAddDocument() {
      this.data.DocumentsFile.push("");
      this.data.DocumentsFileName.push("");
      this.documentsPathTemp.push("");
  }

  onRemoveDocument(index) {
      this.data.DocumentsFile.splice(index, 1);
      this.data.DocumentsFileName.splice(index, 1);
      this.documentsPathTemp.splice(index, 1);
  }

  documentInputChanged(index) {
      let documentInput = document.getElementById('documentInput' + index);

      if (documentInput.files[0]) {
          let reader = new FileReader();
          let amountInput = document.getElementById('amount' + index);
          reader.onload = event => {
              let base64Document = event.target.result;
              const base64Content = base64Document.substring(base64Document.indexOf(',') + 1);
              if (base64Content.length * 6 / 8 > 52428800) {
                  documentInput.value = "";
                  this.data.DocumentsFile[index] = "";
                  this.data.DocumentsFileName[index] = "";
                  alert("Maximum Document Size is 50 MB")
              } else {
                  // Hapus separator koma dari nilai input sebelum mengonversi ke angka
                  const rawAmount = amountInput.value.replace(/,/g, '');
                  this.data.DocumentsFile[index] = base64Document;
                  this.data.DocumentsFileName[index] = {
                      documentName : documentInput.value.replace(/^.*[\\\/]/, ''),
                      //amount : amountInput.value ? parseFloat(amountInput.value) : 0,
                      amount: rawAmount ? parseFloat(rawAmount) : 0, 
                      documentFile : base64Document
                  };
              }
          }
          reader.readAsDataURL(documentInput.files[0]);
      }
  }

  downloadDocument(index) {
      // this.service.getFile((this.documentsPathTemp[index] || '').replace('/sales/', ''), this.data.DocumentsFileName[index]);

      const linkSource = this.data.DocumentsFile[index];
      const downloadLink = document.createElement("a");
      const fileName = this.data.DocumentsFileName[index].documentName;
      console.log("fileName", fileName);
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
  }


  amountInputChanged(index) {
      let documentInput = document.getElementById('documentInput' + index);

      if (documentInput.files[0]) {
          let reader = new FileReader();
          let amountInput = document.getElementById('amount' + index);
          reader.onload = event => {
              let base64Document = event.target.result;
              const base64Content = base64Document.substring(base64Document.indexOf(',') + 1);
              if (base64Content.length * 6 / 8 > 52428800) {
                  documentInput.value = "";
                  this.data.DocumentsFile[index] = "";
                  this.data.DocumentsFileName[index] = "";
                  alert("Maximum Document Size is 50 MB");
              } else {
                  // Hapus separator koma dari nilai input sebelum mengonversi ke angka
                  const rawAmount = amountInput.value.replace(/,/g, '');
                  this.data.DocumentsFile[index] = base64Document;
                  this.data.DocumentsFileName[index] = {
                      documentName: documentInput.value.replace(/^.*[\\\/]/, ''),
                      amount: rawAmount ? parseFloat(rawAmount) : 0, // Konversi nilai tanpa separator
                      documentFile: base64Document
                  };
              }
          };
          reader.readAsDataURL(documentInput.files[0]);
      }
  }

  // formatNumber(event, index) {
  //     const input = event.target;
  //     console.log(input);
  //     const rawValue = input.value.replace(/,/g, ''); // Hapus separator sebelumnya
  //     if (!isNaN(rawValue)) {
  //         const formattedValue = new Intl.NumberFormat('en-US').format(rawValue); // Tambahkan separator
  //         input.value = formattedValue; // Tampilkan nilai dengan separator
  //         //this.data.DocumentsFileName[index].amount = parseFloat(rawValue); // Simpan nilai asli tanpa separator
  //     }
  // }

  formatNumber(event, index) {
      const input = event.target;
      let rawValue = input.value.replace(/,/g, '');

      // Izinkan input kosong, atau hanya "."
      if (rawValue === '' || rawValue === '.') {
          input.value = rawValue;
          return;
      }

      // Pisahkan integer & desimal (maksimal 1 titik)
      let [integerPart, decimalPart] = rawValue.split('.');

      // Hanya izinkan angka
      if (!/^\d+$/.test(integerPart)) {
          input.value = '';
          return;
      }

      // Format integer
      let formattedInt = new Intl.NumberFormat('en-US').format(Number(integerPart));

      // Gabungkan lagi dengan desimal jika ada (biar ".00" tetap muncul)
      let formattedValue = decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;

      input.value = formattedValue;

      // Jika ingin simpan raw value tanpa separator:
      // this.data.DocumentsFileName[index].amount = parseFloat(rawValue);
  }

  formatAmount(amount) {
    console.log(amount);
    if (amount == null) return '';
    
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");  // Menambahkan separator koma
  }



  

}
