import { inject, bindable, computedFrom } from "aurelia-framework";
var UnitLoader = require("../../../loader/garment-units-gmt-loader");
var PreSalesContractLoader = require("../../../loader/garment-pre-sales-contracts-loader");
import { CoreService } from "./service";
import SectionLoader from "../../../loader/garment-sections-loader";
import GarmentBuyerLoader from "../../../loader/garment-buyers-loader";
import GarmentBuyerBrandLoader from "../../../loader/garment-buyer-brands-loader";
import { read } from "xlsx";

@inject(CoreService)
export class DataForm {
  @bindable readOnly = false;
  @bindable isEdit = false;
  @bindable data = {};
  @bindable title;
  @bindable selectedPreSalesContract;
  @bindable dataSection;
  @bindable dataBuyerBrand;

  constructor(coreService) {
    this.coreService = coreService;
  }

  controlOptions = {
    label: {
      length: 4,
    },
    control: {
      length: 5,
    },
  };
  
  // prTypes = ["MASTER", "SAMPLE", "SUBCON", "TERIMA SUBCON"];

  prTypes = ["MOQ","PRE-JOB","OB", "SAMPLE", "SUBCON", "TERIMA SUBCON"];

  formOptions = {
    cancelText: "Kembali",
    saveText: "Simpan",
    deleteText: "Hapus",
    editText: "Ubah",
  };

  // @computedFrom("data.PRType")
  // get salesContractFilter() {
  //   let filter = {
  //     IsPosted: true,
  //     // SCType: this.data.PRType == "MASTER" ? "JOB ORDER" : this.data.PRType,
  //   };

  //   if (this.data.PRType == "SAMPLE") {
  //     filter.IsPR = false;
  //     filter.SCType = "SAMPLE";
  //   } else if (this.data.PRType == "MASTER") {
  //     filter.SCType = "JOB ORDER";
  //   } else if (this.data.PRType == "SUBCON") {
  //     let filterSubcon = {
  //       IsPosted: true,
  //       'SCType == "SUBCON KELUAR" || SCType == "SUBCON"': true,
  //     };

  //     return filterSubcon;
  //   }

  //   return filter;
  // }

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
    this.dataSection = this.data.SectionName ? { Name: this.data.SectionName } : null;
    this.dataBuyerBrand = this.data.Buyer ? { Id: this.data.Buyer.Id, Code: this.data.Buyer.Code, Name: this.data.Buyer.Name } : null;
   
    this.itemOptions = {
      isEdit: this.isEdit,
    };

    if (this.readOnly || this.isEdit) {
      this.itemsColumns.splice(0, 0, { header: "No. PO" });
      this.itemColumnViews.splice(0, 0, { header: "No. PO" });
    }
  }

  unitView = (unit) => {
    return `${unit.Code} - ${unit.Name}`;
  };

  get unitLoader() {
    return UnitLoader;
  }

  get preSalesContractLoader() {
    return PreSalesContractLoader;
  }


  itemsColumns = [
    {value: "IsCMT", titleCheck: "CMT" },
    { header: "Kategori" },
    { header: "Kode Barang" },
    { header: "Komposisi" },
    { header: "Konstruksi" },
    { header: "Yarn" },
    { header: "Width" },
    { header: "Keterangan" },
    { header: "Jumlah" },
    { header: "Satuan" },
    { header: "Price" },
    { header: "Satuan Harga" },
    { header: "Konversi" },
    { header: "Total" },
  ];

  itemColumnViews = [
    { header: "CMT" },
    { header: "Kategori" },
    { header: "Kode Barang" },
    { header: "Komposisi" },
    { header: "Konstruksi" },
    { header: "Yarn" },
    { header: "Width" },
    { header: "Keterangan" },
    { header: "Jumlah" },
    { header: "Satuan" },
    { header: "Price" },
    { header: "Satuan Harga" },
    { header: "Konversi" },
    { header: "Total" },
  ];

  // changePRType(e) {
  //   this.context.selectedPreSalesContractViewModel.editorValue = "";
  //   this.selectedPreSalesContract = null;

  //   if (e.target.value === "MASTER") {
  //     this.context.unitViewModel.editorValue = "";
  //     this.data.Unit = null;
  //   }
  // }
  get sectionLoader() {
    return SectionLoader;
  }
  sectionView = (section) => {
    if(this.readOnly || this.isEdit){
      return section ? `${section.Name}` : "";
    }
    return section ? `${section.Code} - ${section.Name}` : "";
  };
  
      get garmentBuyerBrandLoader() { 
        return GarmentBuyerBrandLoader;
      }
  
      dataBuyerBrandChanged(newValue, oldValue) { 
          if(newValue){
            this.data.Buyer = {
                  Id: newValue.Id,
                  Code: newValue.Code,
                  Name: newValue.Name
              };
          } else {
            this.data.Buyer = null;
          }
    }
  
      buyerBrandView = (buyerBrand) => {
          return buyerBrand ? `${buyerBrand.Code} - ${buyerBrand.Name}` : "";
      }
  
    get buyerQuery(){
      var result = { "Active" : true }
      return result;   
    }
  
  async selectedPreSalesContractChanged(newValue) {
    if (newValue) {
      this.data.SCId = newValue.Id;
      this.data.SCNo = newValue.SCNo;
      this.data.Buyer = {
        Id: newValue.BuyerBrandId,
        Code: newValue.BuyerBrandCode,
        Name: newValue.BuyerBrandName,
      };

      const section = await this.coreService.getGarmentSection(
        newValue.SectionId
      );
      this.data.SectionName = section.Name;
      this.data.ApprovalPR = section.ApprovalCC;
      this.data.ApprovalKadiv = section.ApprovalKadiv;
    } else {
      this.data.SCId = 0;
      this.data.SCNo = null;
      this.data.Buyer = null;
      this.data.SectionName = null;
      this.data.ApprovalPR = null;
      this.data.ApprovalKadiv = null;
    }
  }

  dataSectionChanged(newValue, oldValue){
        if(newValue){
            this.data.Section = newValue.Code;
            this.data.SectionName = newValue.Name;
            this.data.ApprovalPR = newValue.ApprovalCC;
            this.data.ApprovalKadiv = newValue.ApprovalKadiv;
        }else{
          this.data.Section = null;
            this.data.SectionName = null;
            this.data.ApprovalPR = null;
            this.data.ApprovalKadiv = null;
        }
    }
  get addItems() {
    return (event) => {
      this.data.Items.push({
        IsCMT: false,
      });
    };
  }

  get removeItems() {
    return (event) => {
      // console.log(event);
    };
  }
}
