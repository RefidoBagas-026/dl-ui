import { BindingEngine, bindable, computedFrom, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { forEach } from '../../../routes/general';
var moment = require("moment");
const costCalculationGarmentLoader = require('../../../loader/cost-calculation-garment-loader');

@inject(Router, Service, BindingEngine)
export class DataForm {

  length2 = {
    label: {
      align: "left",
      length: 2
    }
  }
  length4 = {
    label: {
      align: "left",
      length: 4
    }
  }

  length14 = {
    label: {
      align: "left",
      length: 12
    }
  }
  CCG_M_FabricInfo = {
    columns: [
      { header: "Material Used", value: "IsMaterialCancelled" },
      { header: "Product Code" },
      { header: "Composition" },
      { header: "Construction" },
      { header: "Yarn" },
      { header: "Width" },
      { header: "Description", value: "Description" },
      { header: "Detil Barang", value: "Detil Barang" },
      { header: "Quantity", value: "Quantity" },
      { header: "Used Quantity", value: "QuantityUsageRO" },
      { header: "Remark", value: "Information" }
    ]
  }
  CCG_M_AccessoriesInfo = {
    columns: [
      { header: "Material Used", value: "IsMaterialCancelled" },
      { header: "Product Code" },
      { header: "Description", value: "Description" },
      { header: "Detil Barang", value: "Detil Barang" },
      { header: "Quantity", value: "Quantity" },
      { header: "Used Quantity", value: "QuantityUsageRO" },
      { header: "Remark", value: "Information" }
    ]
  }
  CCG_M_ProcessInfo = {
    columns: [
      { header: "Material Used", value: "IsMaterialCancelled" },
      { header: "Product Code" },
      { header: "Description", value: "Description" },
      { header: "Detil Barang", value: "Detil Barang" },
      { header: "Quantity", value: "Quantity" },
      { header: "Used Quantity", value: "QuantityUsageRO" },
      { header: "Remark", value: "Information" }
    ]
  }

  CCG_M_RateInfo = {
    columns: [
      { header: "Product Code" },
      { header: "Composition" },
      { header: "Construction" },
      { header: "Yarn" },
      { header: "Width" },
      { header: "Name", value: "Material" },
      { header: "Description", value: "Description" },
      { header: "Quantity", value: "Quantity" },
      { header: "Remark", value: "Information" }
    ]
  }
  RO_Garment_SizeBreakdownsInfo = {
    columns: [
      { header: "No.", value: "SizeBreakdownIndex" },
      { header: "Color", value: "Color" },
      { header: "Size Range", value: "RO_Garment_SizeBreakdowns_Detail" },
    ],
    options: { readOnly: this.readOnly },
    onAdd: function () {
      this.data.RO_Garment_SizeBreakdowns.push({});
      this.data.RO_Garment_SizeBreakdowns.forEach((m, i) => m.SizeBreakdownIndex = i);
    }.bind(this),
    onRemove: function () {
      this.data.RO_Garment_SizeBreakdowns.forEach((m, i) => m.SizeBreakdownIndex = i);
    }.bind(this)
  };

  @bindable title;
  @bindable data = {};
  @bindable error = {};
  @bindable readOnly;
  @bindable isCopy;
  @bindable CopyROData;
  @bindable enableCopyRO = false;
  disabled = true;
  shown = false;
  @bindable listProcess = ["PROCESS","PROCESS CUTTING","PROCESS SEWING","PROCESS FINISHING"];

  @bindable costCalculationGarment;
  CCG_M_Fabric = [];
  CCG_M_Accessories = [];
  CCG_M_Rate = [];
  CCG_M_Process = [];

  @computedFrom("data.Id")
  get isEdit() {
    return (this.data.Id || '').toString() != '';
  }

  get costCalculationGarmentLoader() {
    return costCalculationGarmentLoader;
  }

  get filterCostCalculationGarment() {
    //return { "RO_GarmentId": null, "SCGarmentId":null }
    //return { "RO_GarmentId== null && SCGarmentId > 0": true };
    return { "RO_GarmentId== null":true};
  }
  get filterCopyROData() {
    //return { "RO_GarmentId": null, "SCGarmentId":null }
    //return { "RO_GarmentId== null && SCGarmentId > 0": true };
    return { [`IsPosted== true && RO_Number != "${this.costCalculationGarment ? this.costCalculationGarment.RO_Number : null}"`]:true};
  }

  copyRO() {
    this.enableCopyRO = !this.enableCopyRO;
  }

  constructor(router, service, bindingEngine) {
    this.router = router;
    this.service = service;
    this.bindingEngine = bindingEngine;
  }

  @bindable imageUpload;
  imageUploadChanged(newValue) {
    if (newValue) {
      let imageInput = document.getElementById('imageInput');
      let reader = new FileReader();
      reader.onload = event => {
        let base64Image = event.target.result;
        this.imagesSrc.push(base64Image);
        this.imagesSrcChanged(this.imagesSrc);
      }
      reader.readAsDataURL(imageInput.files[0]);
      this.imageUpload = null;
    }
  }

  @bindable imagesSrc = [];
  imagesSrcChanged(newValue) {
    this.data.ImagesFile = [];
    newValue.forEach(imageSrc => {
      this.data.ImagesFile.push(imageSrc);
    })
  }

  removeImage(index) {
    this.imagesSrc.splice(index, 1);
    this.data.ImagesName.splice(index, 1);
    this.imagesSrcChanged(this.imagesSrc);
  }

  async bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
    this.readOnly = this.context.readOnly ? this.context.readOnly : false;
    this.RO_Garment_SizeBreakdownsInfo.options.readOnly = this.readOnly;
    if (this.data.CostCalculationGarment) {
      if (this.isCopy) {
        if (this.data.CostCalculationGarment.CostCalculationGarment_Materials.length !== 0) {
          this.CCG_M_Fabric = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => item.Category.name.toUpperCase() === "FABRIC");
          this.CCG_M_Accessories = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => item.Category.name.toUpperCase() !== "FABRIC" && !this.listProcess.includes(item.Category.name.toUpperCase()));
          this.CCG_M_Process = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => this.listProcess.includes(item.Category.name.toUpperCase()));
          this.oldFabric = this.CCG_M_Fabric;
          this.oldAcc = this.CCG_M_Accessories;
          this.oldProcess = this.CCG_M_Process;
        
        }
      } else {
        this.costCalculationGarment = this.data.CostCalculationGarment;
      }
    }
    this.data.ImagesFile = this.data.ImagesFile ? this.data.ImagesFile : [];
    this.data.ImagesName = this.data.ImagesName ? this.data.ImagesName : [];
    this.imagesSrc = this.data.ImagesFile.slice();
    this.data.DocumentsFile = this.data.DocumentsFile || [];
    this.data.DocumentsFileName = this.data.DocumentsFileName || [];
    this.documentsPathTemp = [].concat(this.data.DocumentsPath);
  }

  async costCalculationGarmentChanged(newValue) {
    if (newValue && newValue.Id) {
      if (!this.isEdit) {
        this.data.CostCalculationGarment = await this.service.getCostCalculationGarmentById(newValue.Id);
        this.data.CostCalculationGarment.ImageFile = this.data.CostCalculationGarment.ImageFile || '#';
        this.data.Total = this.data.CostCalculationGarment.Quantity;
      }
      if (this.data.CostCalculationGarment.CostCalculationGarment_Materials.length !== 0) {
        if (this.isCopy) {
          this.isCopy = false;
          this.newFab = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => item.Category.name.toUpperCase() === "FABRIC");
          this.newAcc = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => item.Category.name.toUpperCase() !== "FABRIC" && !this.listProcess.includes(item.Category.name.toUpperCase()));
          this.newProcess = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => this.listProcess.includes(item.Category.name.toUpperCase()));
          this.newFab.forEach(element => {
            var exist = this.oldFabric.find(a => a.Product.Id === element.Product.Id && a.Description === element.Description);
            if (exist) {
              element.Information = exist.Information;
            }
          });

          this.newAcc.forEach(element => {
            var exist = this.oldAcc.find(a => a.Product.Id === element.Product.Id && a.Description === element.Description);
            if (exist) {
              element.Information = exist.Information;
            }
          })

          this.newProcess.forEach(element => {
            var exist = this.oldProcess.find(a => a.Product.Id === element.Product.Id && a.Description === element.Description);
            if (exist) {
              element.Information = exist.Information;
            }
          });
          this.CCG_M_Fabric = this.newFab;
          this.CCG_M_Accessories = this.newAcc;

          this.CCG_M_Process = this.newProcess;
        } else {
          this.CCG_M_Fabric = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => item.Category.name.toUpperCase() === "FABRIC");
          this.CCG_M_Accessories = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => item.Category.name.toUpperCase() !== "FABRIC" && !this.listProcess.includes(item.Category.name.toUpperCase()));
          this.CCG_M_Process = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => this.listProcess.includes(item.Category.name.toUpperCase()));
        }

        // this.CCG_M_Rate = this.data.CostCalculationGarment.CostCalculationGarment_Materials.filter(item => item.Category.Name.toUpperCase() === "ONG");
      }
      
    }
    else {
      //this.data.CostCalculationGarment.CostCalculationGarment_Materials=[];
      this.data.CostCalculationGarment = null;
      //this.data.CostCalculationGarment.ImageFile = '#';
      this.CCG_M_Fabric = [];
      this.CCG_M_Accessories = [];
      this.CCG_M_Process = [];
      this.data.Total = 0;
    }
  }

  @computedFrom('data.CostCalculationGarment')
  get hasCostCalculationGarment() {
    if (this.isCopy) {
      return true;
    }
    return this.data.CostCalculationGarment && this.data.CostCalculationGarment.Id;
  }

  @computedFrom("CCG_M_Fabric")
  get hasCCG_M_Fabric() {
    return this.CCG_M_Fabric.length !== 0;
  }

  @computedFrom("CCG_M_Accessories")
  get hasCCG_M_Accessories() {
    return this.CCG_M_Accessories.length !== 0;
  }

  @computedFrom("CCG_M_Process")
  get hasCCG_M_Process() {
    return this.CCG_M_Process.length !== 0;
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

  downloadDocument(index) {
    // this.service.getFile((this.documentsPathTemp[index] || '').replace('/sales/', ''), this.data.DocumentsFileName[index]);

    const linkSource = this.data.DocumentsFile[index];
    const downloadLink = document.createElement("a");
    const fileName = this.data.DocumentsFileName[index];

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  async documentInputChanged(index) {
    let documentInput = document.getElementById('documentInput' + index);
    if (!documentInput.files[0]) return;

    try {
      const file = documentInput.files[0];
      // =========================
      // VALIDASI SIZE
      // =========================
      if (file.size > 52428800) {
        throw new Error("Maximum Document Size is 50 MB");
      }
      // =========================
      // BACA FILE
      // =========================
      const arrayBuffer = await file.arrayBuffer();
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("File corrupt");
      }

      // =========================
      // VALIDASI SIGNATURE
      // =========================
      const bytes = new Uint8Array(arrayBuffer.slice(0, 8));
      const signature = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
      const extension = file.name.split('.').pop().toLowerCase();

      let valid = false;

      // PDF
      if (extension === "pdf" && signature.startsWith("25504446")){
          valid = true;
      }
      // XLSX / DOCX
      else if (["xlsx", "docx"].includes(extension) && signature.startsWith("504b0304")){
          valid = true;
      }
      // XLS / DOC lama
      else if (["xls", "doc"].includes(extension) && signature.startsWith("d0cf11e0")) {
          valid = true;
      }

      if (!valid) {
        throw new Error(`File "${file.name}" corrupt or is not a valid document`);
      }

      // =========================
      // BASE64
      // =========================
      const reader = new FileReader();
      reader.onload = event => {
        let base64Document = event.target.result;
        this.data.DocumentsFile[index] = base64Document;
        this.data.DocumentsFileName[index] = file.name;
      };

      reader.onerror = () => {
        throw new Error(`Failed reading file ${file.name}`);
      };

      reader.readAsDataURL(file);
    }
    catch (error) {
      documentInput.value = "";
      this.data.DocumentsFile[index] = "";
      this.data.DocumentsFileName[index] = "";
      alert(error.message);
      console.error(error);
    }
  }

  download() {
    var endpoint = 'ro-garments/download-template';
    var request = {
        method: 'GET'
    };

    var getRequest = this.service.endpoint.client.fetch(endpoint, request);
    this.service._downloadFile(getRequest);
    this.service.publish(getRequest);
  }
  
  viewData() {
    this.disabled = true;
    var totalQty = 0;
    const fileInput = document.getElementById("fileCsv");
    const fileList = fileInput.files;

    if (!fileList || fileList.length === 0) {
      alert("Silakan pilih file terlebih dahulu.");
      return;
    }

    const file = fileList[0];
    const reader = new FileReader();

    const itemMap = {}; // gunakan object untuk indexing
    const err = [];
    var SizeBreakdownIndex = 0;
    var SizeBreakdownDetailIndex = 0;
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const table = document.getElementById("csv-table");
      table.innerHTML = "";

      rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) {
          const thead = document.createElement("thead");
          const headerRow = document.createElement("tr");
          row.slice(0, 13).forEach(cell => {
            const th = document.createElement("th");
            th.textContent = (cell || "").trim();
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);
          return;
        }
        const tr = document.createElement("tr");

        for (let a = 0; a < 13; a++) {
          const td = document.createElement("td");

          const colLetter = this.getExcelColumnName(a);
          const cellRef = `${colLetter}${rowIndex + 1 }`; // +1 karena zero-based, +1 lagi karena baris header

          if (row[a] === undefined) {
            row[a] = "";
          }
          if(a<=6 && row[a] === "") {
            err.push(`Sel ${cellRef} tidak terisi`);
            td.style.backgroundColor = "#ffcccc";
          }
          else if(a===6){
            const v = String(row[a]).trim();
            if (isNaN(Number(v))) {
              err.push(`Sel ${cellRef} harus berupa angka`);
              td.style.backgroundColor = "#ffcccc";
            }
          }

          td.textContent = String(row[a]).trim();
          td.style.height = "30px";
          tr.appendChild(td);
        }

        table.appendChild(tr);

        if (err.length === 0) {
          const [
            PONo, Style, Color, Size, Fit, Destination,
            QuantityRaw, RemarkMTM,
            Customer, SeasonCode, ShipMode, Barcode, PackType
          ] = row.map(cell => String(cell != null ? cell : "").trim());

          const Quantity = Number(QuantityRaw) || 0;

          totalQty += Quantity;
          const key = `${PONo}-${Style}-${Destination}-${Color}`;

          const detailItem = {
            Destination,
            SizeBreakdownDetailIndex: 0,
            Size,
            Quantity,
            Barcode,
            PackType,
            Fit,
            RemarkMTM,
          };

          if (!itemMap[key]) {
            SizeBreakdownDetailIndex=0;
            itemMap[key] = {
              SizeBreakdownIndex: SizeBreakdownIndex++,
              PONo,
              Style,
              Color:{Id: 0, Name: Color},
              Total: Quantity || 0,
              Customer,
              SeasonCode,
              ShipMode,
              RO_Garment_SizeBreakdown_Details: [detailItem]
            };
          } else {
            SizeBreakdownDetailIndex=itemMap[key].RO_Garment_SizeBreakdown_Details.length;
            detailItem.SizeBreakdownDetailIndex = SizeBreakdownDetailIndex;
            itemMap[key].RO_Garment_SizeBreakdown_Details.push(detailItem);
            itemMap[key].Total += Quantity || 0;
          }
        }
      });
      // ⏬ Pemindahan mapping ke RO_Garment_SizeBreakdowns setelah parsing selesai
      if (err.length === 0) {
        this.data.error =[];
        this.shown = true;
        this.data.RO_Garment_SizeBreakdowns = Object.values(itemMap);
      } else {
        this.data.error = err;
        alert(`Mohon periksa kembali file XLSX Anda. Terdapat ${err.length} kesalahan.`);
      }
    };
    //this.data.total= totalQty;

    this.shown = true;
    reader.readAsArrayBuffer(file);
  }

  // excelDateToJSDate(serial) {
  //   const utc_days = Math.floor(serial - 25569);
  //   const utc_value = utc_days * 86400;
  //   const date_info = new Date(utc_value * 1000);
  //   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
  // }

  getExcelColumnName(colIndex) {
    let columnName = "";
    let dividend = colIndex + 1;

    while (dividend > 0) {
      let modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnName;
  }

  CopyRODataChanged(newValue, oldValue) {

    if (!newValue || !newValue.RO_Number) {
      return;
    }

    this.service.getDataRO(newValue.RO_Number)
      .then(result => {

        if (!result || result.length === 0) {
          console.warn("Data RO tidak ditemukan");
          return;
        }

        this.CopyROData = newValue;

        this.data.DocumentsFile = result.DocumentsFile;
        this.data.DocumentsFileName = result.DocumentsFileName ? this.parseArray(result.DocumentsFileName) : [];
        this.data.DocumentsPath = result.DocumentsPath ? this.parseArray(result.DocumentsPath) : [];
        this.data.Instruction = result.Instruction;
        this.data.ImagesFile = result.ImagesFile;
        this.imagesSrc = result.ImagesFile ? this.parseArray(result.ImagesFile) : [];
        this.data.ImagesName = result.ImagesName ? this.parseArray(result.ImagesName) : [];
        this.data.ImagesPath = result.ImagesPath ? this.parseArray(result.ImagesPath) : [];
        this.documentsPathTemp = result.DocumentsPath ? this.parseArray(result.DocumentsPath) : [];
        console.log("Data RO fetched:", result);
      })
      .catch(error => {
        console.error("Error fetching Data RO:", error);
      });
  }
  parseArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse array:", value, error);
    return [];
  }
}
  // convertExcelDateToMoment(excelDateNumber) {
  //   return moment("1900-01-01").add(excelDateNumber - 2, 'days'); // Excel has an offset bug for leap year 1900
  // }

}

