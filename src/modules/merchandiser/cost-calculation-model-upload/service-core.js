import { RestService } from '../../../utils/rest-service';

const garmentByCode = 'master/garmentProducts/byCode';
const getMaterialFromUpload = 'master/garmentProducts/get-material-from-upload';
const garmentProductSingleByNameServiceUri = 'master/garmentProducts/byName';
const uomServiceUri = 'master/uoms';
const sectionServiceUri = 'master/garment-sections';
const serviceMasterGarmentProductUri = 'master/garmentProducts';
const categoryServiceUri = 'master/garment-categories';
const serviceUriCC = "master/garment-rates-cc";

export class ServiceCore extends RestService {

  constructor(http, aggregator, config) {
    super(http, aggregator, config, "core");
  }

  getByName(name) {
    var endpoint = `${garmentProductSingleByNameServiceUri}?name=${name}`;
    return super.get(endpoint)
      .then((result) => {
        return result;
      })
  }

  getByCode(code) {
    var endpoint = `${garmentByCode}?code=${code}`;
    return super.get(endpoint)
      .then((result) => {
        return result;
      })
  }
  getMaterialFromUpload(data){
    var endpoint = `${getMaterialFromUpload}`;
    return super.post(endpoint, data);
  }
  getUomByUnit(unit) {
    var endpoint = `${uomServiceUri}?keyword=${unit}`;
    return super.get(endpoint)
      .then((result) => {
        if (result && result.length > 0) {
          return result[0];
        } else {
          return null;
        }
      })
  }

  getGarmentProductsByIds(info) {
    var endpoint = `${serviceMasterGarmentProductUri}/byId`;
    return super.list(endpoint, { garmentProductList: info })
      .then((result) => result.data);
  }

  getSection(id) {
    var endpoint = `${sectionServiceUri}/${id}`;
    return super.get(endpoint);
  }

  getCategoryId(id) {
    var endpoint = `${categoryServiceUri}/${id}`;
    return super.get(endpoint);
  }

  searchRateCC(info) {
      var endpoint = `${serviceUriCC}`;
      return super.list(endpoint, info);
  }
}
