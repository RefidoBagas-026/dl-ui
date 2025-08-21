import { containerless } from 'aurelia-framework'
import { InvoiceItemDetail } from './invoice-item-detail';

@containerless()
export class InvoiceItem {
    constructor() {
        // gunakan definisi kolom dari detail VM agar konsisten
        this.detailConfig = new InvoiceItemDetail();
        this.detailsColumns = this.detailConfig.detailsColumns;
    }

    activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.isShowing = false;
        this.options = context.context.options;
    }

    toggle() {
        if (!this.isShowing)
            this.isShowing = true;
        else
            this.isShowing = !this.isShowing;
    }

    controlOptions = {
        control: {
            length: 12
        }
    };
}
