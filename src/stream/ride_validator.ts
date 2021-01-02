import { Transform, TransformCallback, TransformOptions } from "stream";
import Ajv, { ValidateFunction } from "ajv";
import ridesSchema from "../common/schemas/scooter_rides.schema";

class RideValidator extends Transform {
  validate: ValidateFunction<unknown>;

  constructor(options: TransformOptions = {}) {
    super({ objectMode: true, ...options });

    this.validate = new Ajv({ allErrors: true }).compile(ridesSchema);
  }

  _transform(chunk: any, encoding: string, callback: TransformCallback) {
    const isValid = this.validate(chunk);
    this.push({ isValid, ...chunk });

    callback();
  }
}

export default RideValidator;