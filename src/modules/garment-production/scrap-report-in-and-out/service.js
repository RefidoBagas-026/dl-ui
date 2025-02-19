import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';

const serviceUri = 'garment/waste/report';

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "inventory-azure");
    }

    search(info) {
        let endpoint = `${serviceUri}/recap`;
        return super.list(endpoint, info);
    }

    xls(info) {
        const endpoint = this._getEndPoint(info);
        console.log(endpoint, info);
        return super.getXls(endpoint);
    }
    
    _getEndPoint(info) {
        let endpoint = `${serviceUri}/download-flowaval`;
        let queryParams = [];
    
        if (info.dateFrom) queryParams.push(`dateFrom=${encodeURIComponent(info.dateFrom)}`);
        if (info.dateTo) queryParams.push(`dateTo=${encodeURIComponent(info.dateTo)}`);
        if (info.TipeItem) queryParams.push(`type=${encodeURIComponent(info.TipeItem)}`);
        if (info.TransactionType) queryParams.push(`transactionType=${encodeURIComponent(info.TransactionType)}`);
        
    
        if (queryParams.length > 0) {
            endpoint += `?${queryParams.join("&")}`;
        }
    
        return endpoint;
    }
    
    // EXPORT EXCEL
    // xls(info) {
    //     var endpoint = this._getEndPoint(info);
    //     console.log(endpoint, info);
    //     return super.getXls(endpoint);
    // }

    // _getEndPoint(info) {
    //     var endpoint = `${serviceUri}/download-flowaval`;
    //     var query = '';
        
    //     if (info.dateFrom)
    //         if (query === '') query = `dateFrom=${info.dateFrom}`;
    //         else query = `${query}&dateFrom=${info.dateFrom}`;    

    //     if (info.dateTo) {
    //         if (query === '') query = `dateTo=${info.dateTo}`;
    //         else query = `${query}&dateTo=${info.dateTo}`;
    //     }
    //     if (info.TransactionType){
    //         if (query === '') query = `TransactionType=${info.TransactionType}`;
    //         else query = `${query}&TransactionType=${info.TransactionType}`;
    //     }
    //     if (info.TipeItem){
    //         if (query === '') query = `TipeItem=${info.TipeItem}`;
    //         else query = `${query}&TipeItem=${info.TipeItem}`;
    //     }
        
    //     if (query !== '')
    //         endpoint = `${serviceUri}/download-flowaval?${query}`;

    //     return endpoint;
    // }
    // EXPORT EXCEL

}