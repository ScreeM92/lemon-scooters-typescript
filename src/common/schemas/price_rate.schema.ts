import { JSONSchemaType } from "ajv";
import { PriceRateModel } from "../../models/price_rate.model";

const schema: JSONSchemaType<PriceRateModel[]> = {
    title: "rate",
    type: "array",
    items: {
        type: "object",
        properties: {
            zone: {
                type: "string",
                pattern: "[ABC]{1}"
            },
            price: {
                type: "number",
                minimum: 0.01
            },
            currency: {
                type: "string",
                enum: ["USD", "EUR", "GBP"]
            }
        },
        required: ["zone", "price", "currency"]
    }
};
export default schema;

