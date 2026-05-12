import numeral from 'numeral';

export class CostCalculationMaterialFooter {
    activate(context) {
        this.context = context;
        this.colspan = 9;
    }

    get totalMaterial() {
        let totalMaterial = 0;
        for (let item of this.context.items) {
            if (item.data) {
                totalMaterial += numeral(item.data.Total).value();
            }
        }
        return totalMaterial;
    }
}