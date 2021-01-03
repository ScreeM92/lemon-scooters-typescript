import Logger from "./../util/logger";
import esClient from "../elasticsearch";

class ElasticSearchService {

  async search(options: Record<string, string>): Promise<any> {
    try {
        const response = await esClient.search(options);
        return response.body.hits.hits;
    } 
    catch (error) {
        Logger.error(error.toString());
        return [];
    }
  }

  async addRideDocument(body: any): Promise<any> {
    try {
        await esClient.index({index: 'rides123', type: 'rides_list', body});
        return true;
    } 
    catch (error) {
        Logger.error(error.toString());
        return false;
    }
  }

  async addErrorDocument(body: any): Promise<any> {
    try {
        await esClient.index({index: 'errors123', type: 'errors_list', body});
        return true;
    } 
    catch (error) {
        Logger.error(error.toString());
        return false;
    }
  }
}

export default new ElasticSearchService;