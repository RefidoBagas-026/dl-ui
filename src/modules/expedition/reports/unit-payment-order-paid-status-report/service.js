import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../../utils/rest-service';

const serviceURI = 'expedition/unit-payment-order-paid-status-report';

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, 'purchasing-azure');
    }
    
    search(info) {
        console.log(info);
        let endpoint = `${serviceURI}`;
        return super.list(endpoint, info);
    }
    generateExcel(info) {
        console.log(info);
            var endpoint = `${serviceURI}/download?UnitPaymentOrderNo=${info.unitPaymentOrderNo}&SupplierCode=${info.supplierCode}&DivisionCode=${info.divisionCode}&SupplierType=${info.SupplierType}&PaymentMethod=${info.PaymentMethod}&Status=${info.status}&DateFromDue=${info.dateFromDue}&DateToDue=${info.dateToDue}&DateFrom=${info.dateFrom}&DateTo=${info.dateTo}`;
            
            return super.getXls(endpoint);
            
        }
}
