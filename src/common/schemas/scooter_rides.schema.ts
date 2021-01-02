import { JSONSchemaType } from "ajv";
import { RideModel } from "../../models/ride.model";

const schema: JSONSchemaType<RideModel> = {
    title: "rides",
    type: "object",
    properties: {
      customerId: {
        type: "string",
        pattern: "[A-Z]{2}(.*)[0-9]{4}"
      },
      startTime: {
        type: "string",
        minLength: 19,
        maxLength: 19
      },
      endTime: {
        type: "string",
        minLength: 19,
        maxLength: 19
      },
      zone: {
        type: "string",
        pattern: "[ABC]{1}"
      }  
    },
    required: ["customerId", "startTime", "endTime", "zone"]
};

export default schema;