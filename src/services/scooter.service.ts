import Logger from "./../util/logger";
import HttpClient from "./../common/http/http_client";
import Ajv from "ajv";
import priceRateSchema from "../common/schemas/price_rate.schema";
import { AxiosResponse } from "axios";

class ScooterService {

  async getRidesCsv(): Promise<any> {
    try {
      return await HttpClient.getFile(process.env.RIDES_URL);
    } catch (error) {
      Logger.error(error.toString());
    }
  }

  async getRate(): Promise<any> {
    try {
      const rate: AxiosResponse<any> = await HttpClient.get(process.env.PRICE_RATE_URL);
      const validate = new Ajv({ allErrors: true }).compile(priceRateSchema);

      const isValid = validate(rate.data);
      if (!isValid) {
        throw new Error(JSON.stringify((validate.errors)));
      }
      
      return rate;
    }
    catch(error) {
      Logger.error(error.toString());
    }
  }
}

export default new ScooterService;