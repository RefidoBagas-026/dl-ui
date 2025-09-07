export class ScanPOItem {
    activate(context) {
        this.data = context.data;
        this.error = context.error;
        this.PricePerDealUnit = this.data.PricePerDealUnit == null ? this.data.PricePerDealUnit : this.data.PricePerDealUnit.toLocaleString('en-EN', { maximumFractionDigits: 4, minimumFractionDigits: 4 });
        this.DealQuantity = this.data.DealQuantity == null ? this.data.DealQuantity : this.data.DealQuantity.toLocaleString('en-EN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    }
}