import SpyInstance = jest.SpyInstance;
import HttpClient from "../../src/common/http/http_client";
import ScooterService from "../../src/services/scooter.service";
import StreamTest from "streamtest";

describe("ScooterService", () => {

  StreamTest.versions.forEach((version) => {
    describe("for " + version + " streams", () => {

      it("should return all price rates", async (done: jest.DoneCallback) => {
        const priceRates: any = {
            data: [
                {
                    "zone": "A",
                    "price": 0.10,
                    "currency": "USD"
                },
                {
                    "zone": "B",
                    "price": 0.50,
                    "currency": "USD"
                },
                {
                    "zone": "C",
                    "price": 1,
                    "currency": "USD"
                }
            ]
        };

        const spy: SpyInstance = jest.spyOn(HttpClient, "get").mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(priceRates);
            });
        });

        const rates = await ScooterService.getRate();
        expect(priceRates).toEqual(rates);

        spy.mockRestore();
        done();
      });

    });
  });
});