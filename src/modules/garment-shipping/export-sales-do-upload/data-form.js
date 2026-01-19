import { inject, bindable, containerless, computedFrom, BindingEngine } from 'aurelia-framework'
import { Service } from "./service";
import * as XLSX from 'xlsx';

const UnitLoader=require('../../../loader/unit-loader')
var BuyerLoader = require('../../../loader/garment-buyers-loader');
const costCalculationGarmentLoader = require('../../../loader/cost-calculation-garment-loader');

@inject(Service)
export class DataForm {

    constructor(service) {
        this.service = service;
    }

    @bindable isCreate = false;
    @bindable readOnly = false;
    @bindable title;
    @bindable selectedUnit;
    @bindable buyer;
    @bindable selectedBuyer;
    @bindable previewData = [];
    @bindable headers = [];

    controlOptions = {
        label: {
            length: 3
        },
        control: {
            length: 5
        }
    };
    filter={
        IsUsed:true
    };
    footerOptions = {
        label: {
            length: 3
        },
        control: {
            length: 2
        }
    };

    itemsColumns = [
        { header: "RO Number" },
        { header: "Buyer Brand" },
        { header: "Quantity Order" },
        { header: "Note" },
    ];

    get packingListLoader() {
        return PackingListLoader;
    }
    get unitLoader(){
        return UnitLoader;
    }

    get unitQuery(){
        var result = { "Description" : "GARMENT" }
        return result;   
      }

    get buyerLoader() {
        return BuyerLoader;
    }

    bind(context) {
        this.context = context;
        console.log(this.context);
        this.data = context.data;
        this.error = context.error;
        this.isEdit=this.context.isEdit;
        this.isCreate=this.context.isCreate;
        this.Options = {
            isCreate: this.context.isCreate,
            isView: this.context.isView,
            isEdit: this.context.isEdit,
        }
        this.hasEdit = this.data ? (this.data.packingListNo ? true : false) : false;

        if (this.data.id) {
            // mapping header
            this.data.ExportSalesDONo = this.data.exportSalesDONo || '';
            this.data.Shipment = this.data.shipment || '';
            this.data.ExFactoryDate = this.data.exFactoryDate || null;
            this.selectedBuyer = this.data.buyerAgent || null;
            this.data.FinalDestination = this.data.finalDestination || '';

            // mapping items
            if (Array.isArray(this.data.items)) {
                this.data.Items = this.data.items.map(item => ({
                    ...item,
                    RONumber: item.roNumber,
                    BuyerBrand: item.buyerBrand, // object, jangan diubah
                    QuantityOrder: item.quantityOrder,
                    Note: item.note
                }));
            }
        }
    }

    buyerView = (buyer) => {
        var buyerName = buyer.Name || buyer.name;
        var buyerCode = buyer.Code || buyer.code;
        return `${buyerCode} - ${buyerName}`
    }

    get buyerQuery(){
    var result = { "Active" : true }
    return result;   
    }

    async selectedBuyerChanged(newValue) {
        this.data.BuyerAgent = null;
        if (newValue) {
            this.data.BuyerAgent = newValue;
        }
        console.log(this.data);
    }

    ShipmentItems= ['Sea','Air','Sea-Air','Courier'];
    ShipmentItemsChanged(newvalue)
    {
        if(newvalue)
        {
            if (newvalue === "Sea") {
                this.data.Shipment = "Sea";
            }
            else if(newvalue === "Air")
            {
                this.data.Shipment = "Air";
            }
            else if(newvalue == "Sea-Air")
            {
                this.data.Shipment = "Sea-Air";
            }
            else if(newvalue == "Courier")
            {
                this.data.Shipment = "Courier";
            }
            else{
            this.data.Shipment = "-";
            }
        }
    } 
    downloadExcelTemplate() {
    // Header Excel
        const headers = [
        ['No. RO', 'Note']
        ];

        // Buat worksheet dari array
        const worksheet = XLSX.utils.aoa_to_sheet(headers);

        // Optional: atur lebar kolom
        worksheet['!cols'] = [
        { wch: 20 }, // No. RO
        { wch: 40 }  // Note
        ];

        // Buat workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

        // Download file
        XLSX.writeFile(workbook, 'Template_No_RO.xlsx');
    }
    async handleFileUpload(event) {   
    const file = event.target.files[0];
    if (!file) return;
    
    /* ===============================
     * RESET DATA SETIAP FILE BARU
     * =============================== */
    this.data = this.data || {};
    this.error = this.error || {};

    this.data.Items = this.data.Items || [];
    this.error.Items = this.error.Items || [];

    this.data.Items.length = 0;
    this.error.Items.length = 0;

    this.previewData = [];
    this.headers = [];
    /* =============================== */
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
            alert("File kosong atau tidak memiliki data.");
            return;
        }
        // Expected header sesuai template
        const expectedHeaders = [
            "No. RO",// wajib
            "Note"
        ];

        let actualHeaders = Object.keys(jsonData[0]);
        for (let header of expectedHeaders) {
            if (!actualHeaders.includes(header)) {
                alert(`Template tidak sesuai.`);
                return;
            }
        }
        // Hanya ambil header yang valid (tanpa __EMPTY, dst)
        const cleanData = jsonData.map(row => {
            const cleanedRow = {};
            expectedHeaders.forEach(header => {
                cleanedRow[header] = row.hasOwnProperty(header) ? row[header] : "";
            });
            return cleanedRow;
        });

        // Hapus semua isi jsonData
        jsonData.length = 0;

        // Isi ulang hanya baris yang tidak kosong total
        jsonData.push(
          ...cleanData.filter(row =>
            Object.values(row).some(val =>
              val !== null &&
              val !== undefined &&
              !(typeof val === "string" && val.trim() === "")
            )
          )
        );

       const mandatoryColumns = [
            "No. RO",// wajib
            "Note"
        ];
        // Validasi kolom wajib tidak boleh kosong
        const errors = [];
        jsonData.forEach((row, rowIndex) => {
            mandatoryColumns.forEach(col => {
                const val = row[col];

                // Cek wajib terisi, tapi 0 harus dianggap valid
                const isEmpty =
                    val === null ||
                    val === undefined ||
                    (typeof val === "string" && val.trim() === "");

                if (isEmpty) {
                    errors.push(`Kolom "${col}" pada baris ${rowIndex + 2} tidak boleh kosong`);
                }
            });
        });

        if (errors.length > 0) {
            if (confirm("Terdapat data kosong, download file error?")) {
                this.downloadErrorExcel(errors);
            }
           
            return;
        }
      this.previewData = jsonData;
      this.headers = actualHeaders;

      console.log(this.previewData);
      await this.pushDataExcel(this.previewData);
    };

    event.target.value = null;
   // document.getElementById("fileCsv").value = null;
    reader.readAsArrayBuffer(file);
    
  }

    async pushDataExcel(data) {
        for (let item of data) {
            const roNumber = item["No. RO"];
            console.log(this.data);
            if (!roNumber) continue;
            try {
                const filter = {
                RO_Number: JSON.stringify(roNumber),
                "SCGarmentId!=null": true,
                IsDeleted: false
                };

                if (this.data && this.data.BuyerAgent && this.data.BuyerAgent.Id) {
                filter.BuyerId = JSON.stringify(this.data.BuyerAgent.Id);
                }

                const results = await costCalculationGarmentLoader(roNumber, filter);
                if (results && results.length > 0) {
                    const cc = results[0];
                    // Buat item baru dengan data dari CostCalculation
                    let newItem = {
                        CostCalculationGarmentId: cc.Id,
                        RONumber: cc.RO_Number,
                        BuyerBrand: cc.BuyerBrand,
                        QuantityOrder: cc.Quantity,
                        Note: item["Note"] || ""
                    };
                    this.data.Items.push(newItem);
                    this.error.Items.push({}) || {};
                } else {
                    // Jika tidak ditemukan, tetap push dengan info minimal
                    let newItem = {
                        CostCalculationGarmentId: 0,
                        RONumber: roNumber,
                        BuyerBrand: null,
                        Quantity: 0,
                        Note: item["Note"] || ""
                    };
                    // this.error.Items.push({ RONumber: `RO Number "${roNumber}" tidak ditemukan.` }) || {};
                    this.data.Items.push(newItem);
                }
            } catch (e) {
                // Error handling jika request gagal
                let newItem = {
                    RONumber: roNumber,
                    BuyerBrand: "ERROR",
                    Quantity: 0,
                    Note: item["Note"] || ""
                };
                this.data.Items.push(newItem);
            }
        }
    }

  downloadErrorExcel(errors) {
    // Buat struktur data untuk Excel
    const errorData = errors.map((msg, index) => ({
        No: index + 1,
        Error: msg
    }));

    const worksheet = XLSX.utils.json_to_sheet(errorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Error Upload");

    // Download file
    XLSX.writeFile(workbook, "Error_Upload.xlsx");
}
}
