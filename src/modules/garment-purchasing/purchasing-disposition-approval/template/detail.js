import { bindable } from 'aurelia-framework'
import { Service } from '../service';
export class PurchasingDispositionDetail {

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = context.error;
    this.options = context.options;
    this.readOnly = context.context.options.options.readOnly;
    this.detailEPONo = context.context.options.data.detailEPONo || [];
   //console.log("detail", this.data);

    //console.log("context", this.detailEPONo);

    const filteredEPONo = this.detailEPONo.filter(detail => detail.IPONo === this.data.IPONo).map(detail => detail.QTYRemains);

    //console.log("filteredEPONo" , filteredEPONo)
    //this.data.QTYPaid  = filteredEPONo.length > 0 ? filteredEPONo[0] : this.data.QTYPaid;
    //console.log("EPOLIST", this.context.context.options.data);
    //console.log("detail",this.data);
    // if(this.data.Product){
    //     this.data.Product.Name=this.data.Product.name || this.data.Product.Name;
    //     this.data.Product.Id=this.data.Product._id || this.data.Product.Id;
    //     this.data.Product.Code=this.data.Product.code || this.data.Product.Code;
        
    //     this.dataProduct = `${this.data.Product.Code} - ${this.data.Product.Name}`;
    //     this.data.Product.uom=this.data.DealUom;
    // }
    // if(this.data.DealUom){
    //     this.data.DealUom.Id=this.data.DealUom._id || this.data.DealUom.Id;
    //     this.data.DealUom.Unit=this.data.DealUom.unit||this.data.DealUom.Unit;
    // }
    // if(this.data.Category){
    //     this.data.Category._id=this.data.CategoryId;
    //     this.data.Category.Id=this.data.Category._id || this.data.Category.Id;
    //     this.data.Category.Code=this.data.Category.code||this.data.Category.Code;
    //     this.data.Category.Name=this.data.Category.name||this.data.Category.Name;
    //     this.dataCategory=this.data.Category.Name;
    // }
    // if(this.data.Unit){
    //   this.data.Unit._id=this.data.UnitId;
    // }
    // this.data.PriceTotal=(parseFloat(this.data.DealQuantity)*parseFloat(this.data.PricePerDealUnit)).toLocaleString('en-EN', { minimumFractionDigits: 4 });
    // if(this.readOnly){
    //   this.data.PaidQuantity=this.data.PaidQuantity.toLocaleString('en-EN', { minimumFractionDigits: 2 });
    //   this.data.PaidPrice=this.data.PaidPrice.toLocaleString('en-EN', { minimumFractionDigits: 4 });
    // }
    // this.data.DealQuantity=this.data.DealQuantity;//.toLocaleString('en-EN', { minimumFractionDigits: 2 });
    // this.data.PricePerDealUnit=this.data.PricePerDealUnit;//.toLocaleString('en-EN', { minimumFractionDigits: 4 });
    // console.log("detail",this);
}

  // paidChanged(e) {
  //   this.data.QTYPaid=parseFloat(e.srcElement.value)/this.data.PricePerQTY;
  //   this.data.PaidPrice=parseFloat(e.srcElement.value);
  //   // this.data.QTYRemains = this.data.QTYRemains - this.data.QTYPaid;
  //   this.data.QTYRemains = this.data.QTYOrder - this.data.DispositionQuantityCreated - this.data.QTYPaid;
    
  //   // this.data.DppValue = this.data.PaidPrice;
  //   this.calculatedOver();
  // }

  // paidQtyChanged(e){
  //   // console.log("detail change",)
  //   // console.log("paidQTYChanged",e.srcElement.value);
  //   // console.log("detailPricePerDeal",this.data.PricePerQTY);
  //   this.data.PaidPrice=parseFloat(e.srcElement.value)*this.data.PricePerQTY;
  //   this.data.QTYPaid = parseFloat(e.srcElement.value);
  //   // this.data.QTYRemains = this.data.QTYRemains - this.data.QTYPaid;
  //   this.data.QTYRemains = this.data.QTYOrder - this.data.DispositionQuantityCreated - this.data.QTYPaid;    
  //   // this.data.DppValue = this.data.PaidPrice;
  //   this.calculatedOver();
  // }

  paidChanged(e) {
    this.data.QTYPaid = parseFloat(e.srcElement.value) / this.data.PricePerQTY;
    this.data.PaidPrice = parseFloat(e.srcElement.value);
    this.data.QTYRemains = this.data.QTYOrder - this.data.DispositionQuantityCreated - this.data.QTYPaid;
    
    this.calculatedOver();
  }

  paidQtyChanged(e) {
    const filteredEPONo = this.detailEPONo.filter(detail => detail.IPONo === this.data.IPONo).map(detail => detail.QTYRemains);
    console.log("filteredEPONo", filteredEPONo);
    console.log("paidQtyChanged", e.srcElement.value);
    this.data.PaidPrice = parseFloat(e.srcElement.value) * this.data.PricePerQTY;
    //this.data.QTYPaid = parseFloat(e.srcElement.value);
    if (e !== undefined && e !== null) {
      // Update nilai QTYPaid dengan input baru
      this.data.QTYPaid = parseFloat(e.srcElement.value);
    }
    this.data.QTYRemains =  filteredEPONo.length > 0 ? filteredEPONo[0] - this.data.QTYPaid : this.data.QTYOrder - this.data.DispositionQuantityCreated - this.data.QTYPaid;    
    
    this.calculatedOver();
  }
  calculatedOver(){
    //console.log("calculateOver",this.data);
    if(this.data.QTYRemains < 0 ){
    // var OverQTy = (((this.data.QTYRemains+this.data.QTYPaid)-this.data.QTYOrder)/this.data.QTYOrder)*100;
    var OverQTy = (Math.abs(this.data.QTYRemains)/ this.data.QTYOrder)*100;
    // OverQTy = OverQTy<0?0: OverQTy;
    this.data.PercentageOverQTY = OverQTy;
    }else{
      this.data.PercentageOverQTY = 0;
    }
    // console.log("calculateOver",OverQTy);
  }

  controlOptions = {
    control: {
      length: 12
    }
  };
}

