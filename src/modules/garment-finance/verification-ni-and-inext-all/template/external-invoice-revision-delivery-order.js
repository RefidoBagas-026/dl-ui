import { containerless, bindable } from "aurelia-framework";

@containerless()
export class ExternalInvoiceRevisionDeliveryOrder {
    @bindable data;

    activate(context) {
        this.context = context;
        this.data = context.data;
    }

    controlOptions = {
        control: {
            length: 12
        }
    };
}