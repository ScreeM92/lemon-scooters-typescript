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

  async searchCustomerGroup(options: Record<string, any>, customerId: string): Promise<any> {
    try {
        let filter = {"match_all": {}} as any;
        if (customerId) {
          filter = { "term": { "customerId.keyword": customerId}};
        }

        const response = await esClient.search(
          {
            ...options,
            "body": {
              "aggs": {
                "customer_group": {
                  "terms": {
                    "field": "customerId.keyword",
                    "order": {
                      "price": "desc"
                    }
                  },
                  "aggs": {
                    "price": {
                      "sum": {
                        "field": "price"
                      }
                    }
                  }
                }
              },
              "size": 0,
              "stored_fields": [
                "*"
              ],
              "script_fields": {},
              "docvalue_fields": [],
              "_source": {
                "excludes": []
              },
              "query": {
                "bool": {
                  "must": [],
                  "filter": [filter],
                  "should": [],
                  "must_not": []
                }
              }
            }
          }
        );

        return response.body.aggregations.customer_group.buckets;
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