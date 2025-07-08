export class ScanPOItem {
    activate(context) {
        this.data = context.data;
        this.error = context.error;
        this.readOnly = context.options.readOnly;
    }
}