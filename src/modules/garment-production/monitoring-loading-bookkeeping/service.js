import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';
// import { Container } from 'aurelia-dependency-injection';
// import { Config } from "aurelia-api";

const serviceUri = 'monitoring'; 
export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "dl-report");
    }

    search(info) {
        var endpoint = `${serviceUri}/loading`;
        var query = '';

        if (info.dateFrom && info.dateFrom !== "") {
            if (query === '') query = `dateFrom=${info.dateFrom}`;
            else query = `${query}&dateFrom=${info.dateFrom}`;
        }
        if (info.dateTo && info.dateTo !== "") {
            if (query === '') query = `dateTo=${info.dateTo}`;
            else query = `${query}&dateTo=${info.dateTo}`;
        }
        if (info.unit && info.unit !== "") {
            if (query === '') query = `unit=${info.unit}`;
            else query = `${query}&unit=${info.unit}`;
        }
        if (query !== '')
        endpoint = `${serviceUri}/loading?${query}`;

    return super.get(endpoint);

      
    }

    generateExcel(info) {
        var endpoint = `${serviceUri}/loading-download?unit=${info.unit}&dateFrom=${info.dateFrom}&dateTo=${info.dateTo}&type=${info.type}`;
        console.log(endpoint);
        var query = '';
        if (info.dateFrom && info.dateFrom !== "") {
            if (query === '') query = `dateFrom=${info.dateFrom}`;
            else query = `${query}&dateFrom=${info.dateFrom}`;
        }
        if (info.dateTo && info.dateTo !== "") {
            if (query === '') query = `dateTo=${info.dateTo}`;
            else query = `${query}&dateTo=${info.dateTo}`;
        }
        if (info.unit && info.unit !== "") {
            if (query === '') query = `unit=${info.unit}`;
            else query = `${query}&unit=${info.unit}`;
        }
        if (info.type && info.type !== "") {
            if (query === '') query = `type=${info.type}`;
            else query = `${query}&type=${info.type}`;
        }
        if (query !== '')
        endpoint = `${serviceUri}/loading-download?${query}`;
        console.log(endpoint);
    return super.getXls(endpoint);
    }
}


export class PurchasingService extends RestService {

    constructor(http, aggregator, config, api){
        super(http, aggregator, config, "purchasing-azure")
    }

    
}