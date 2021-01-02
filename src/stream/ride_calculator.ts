import { Transform, TransformCallback, TransformOptions } from "stream";
import moment from "moment";
import { keyBy, Dictionary } from "lodash";
import { PriceRateModel } from "../models/price_rate.model";

class RideCalculator extends Transform {
  priceRate: Dictionary<any>;

  constructor(priceRateList: PriceRateModel[], options: TransformOptions = {}) {
    super({ objectMode: true, ...options });

    this.priceRate = keyBy(priceRateList, "zone");
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    if (chunk.isValid) {
      const dateFormat = "YYYY-MM-DD HH:mm:ss";
      const start = moment(chunk.startTime, dateFormat);
      const end = moment(chunk.endTime, dateFormat);
      const minutes = Math.ceil(moment.duration(end.diff(start)).asMinutes());
      const ride = this.priceRate[chunk.zone];

      chunk.price = minutes * ride.price;
      chunk.currency = ride.currency;
      chunk.minutes = minutes;
    }
    this.push(chunk);

    callback();
  }
}

export default RideCalculator;