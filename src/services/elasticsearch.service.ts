import Logger from "./../util/logger";
import esClient from "../elasticsearch";
import { ElasticSearchEnum } from '../common/enums/elasticsearch.enum';

class ElasticSearchService {

  async search(options: Record<string, any>): Promise<any> {
    try {
        const response = await esClient.search(options);
        return response.body.hits.hits;
    } 
    catch (error) {
        Logger.error(error.toString());
        return [];
    }
  }

  async count(options: Record<string, any>): Promise<any> {
    try {
        const response = await esClient.count(options);
        return response.body.count;
    } 
    catch (error) {
        Logger.error(error.toString());
        return [];
    }
  }

  async addRideDocument(body: any): Promise<any> {
    try {
      return await esClient.index({index: ElasticSearchEnum.RIDES_INDEX, type: ElasticSearchEnum.RIDES_TYPE, body});
    }
    catch (error) {
      Logger.error(error.toString());
      return false;
    }
  }

  async addErrorDocument(body: any): Promise<any> {
    try {
      return await esClient.index({index: ElasticSearchEnum.ERRORS_INDEX, type: ElasticSearchEnum.ERRORS_TYPE, body});
    } 
    catch (error) {
      Logger.error(error.toString());
      return false;
    }
  }
}

export default new ElasticSearchService;