import { RestService } from '../../../utils/rest-service';


const serviceUri = 'purchase-requests/by-user';
const getAllUri = 'purchase-requests';

class Service extends RestService {

     constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }

     search(info) {
        var endpoint = `${getAllUri}`;
        return super.list(endpoint, info);
    }


    getById(id) {
        var endpoint = `${serviceUri}/${id}`;
        var info = {
            select: ["no", "date", "unit", "category", "remark", "product.name", "product.uom", "CreatedBy", "isApprovedUnit1", "isApprovedUnit2", "isApprovedManager", "isApprovedGM", "isApprovedAnggaran"]
        };
        return super.get(endpoint, info);
    }


    replace(id, data) {
        var endpoint = `${serviceUri}/${id}`;
        return super.patch(endpoint, data);
    }

    update(id, data) {
        var endpoint = `${serviceUri}/${id}`;
        return super.put(endpoint, data);
    }
    

};

export { Service }
