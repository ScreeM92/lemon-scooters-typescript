import RideCalculator from "../../src/stream/ride_calculator";
import StreamTest from "streamtest";

const priceRate = [
  {
    "zone": "A",
    "price": 0.20,
    "currency": "USD"
  },
  {
    "zone": "B",
    "price": 0.30,
    "currency": "USD"
  },
  {
    "zone": "C",
    "price": 0.40,
    "currency": "USD"
  }
];
const validRides = [{"customerId":"LA1169","startTime":"2018-04-01 06:42:57","endTime":"2018-04-01 07:15:50","zone":"B", isValid: true}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01 11:03:15","zone":"A", isValid: true}, {"customerId":"NP1443","startTime":"2018-04-01 21:12:33","endTime":"2018-04-01 21:53:38","zone":"C",isValid: true}];
const validAndInvalidRides = [{"customerId":"LA1169","startTime":"2018-04-01 06:42:57","endTime":"2018-04-01","zone":"B", isValid: false}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01 11:03:15","zone":"A", isValid: true}];
const invalidRides = [{"customerId":"LA1169","startTime":"2018-04-01 06:42:57","endTime":"2018-04-01","zone":"B", isValid: false}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01","zone":"A", isValid: false}];

describe("RideCalculator", () => {

  StreamTest.versions.forEach((version) => {
    describe("for " + version + " streams", () => {
 
      it("should calculate the price for every ride", (done: jest.DoneCallback) => {
        StreamTest[version].fromObjects(validRides)
          .pipe(new RideCalculator(priceRate))
          .pipe(StreamTest[version].toObjects((err, output) => {
            if(err) {
              done(err);
            }

            expect(output).toEqual([
              {
                customerId: "LA1169",
                startTime: "2018-04-01 06:42:57",
                endTime: "2018-04-01 07:15:50",
                zone: "B",
                isValid: true,
                price: 9.9,
                currency: "USD",
                minutes: 33
              },
              {
                customerId: "CE1171",
                startTime: "2018-04-01 09:52:36",
                endTime: "2018-04-01 11:03:15",
                zone: "A",
                isValid: true,
                price: 14.200000000000001,
                currency: "USD",
                minutes: 71
              },
              {
                customerId: "NP1443",
                startTime: "2018-04-01 21:12:33",
                endTime: "2018-04-01 21:53:38",
                zone: "C",
                isValid: true,
                price: 16.8,
                currency: "USD",
                minutes: 42
              },
            ]);

            done();
          })
        );
      });

      it("should calculate the price for a ride and pass the invalid record", (done: jest.DoneCallback) => {
        StreamTest[version].fromObjects(validAndInvalidRides)
          .pipe(new RideCalculator(priceRate))
          .pipe(StreamTest[version].toObjects((err, output) => {
            if(err) {
              done(err);
            }
  
            expect(output).toEqual([
              {
                customerId: "LA1169",
                startTime: "2018-04-01 06:42:57",
                endTime: "2018-04-01",
                zone: "B",
                isValid: false
              },
              {
                customerId: "CE1171",
                startTime: "2018-04-01 09:52:36",
                endTime: "2018-04-01 11:03:15",
                zone: "A",
                isValid: true,
                price: 14.200000000000001,
                currency: "USD",
                minutes: 71
              }
            ]);
  
            done();
          })
        );
      });

      it("should pass the invalid records", (done: jest.DoneCallback) => {
        StreamTest[version].fromObjects(invalidRides)
          .pipe(new RideCalculator(priceRate))
          .pipe(StreamTest[version].toObjects((err, output) => {
            if(err) {
              done(err);
            }
  
            expect(output).toEqual([
              {
                customerId: "LA1169",
                startTime: "2018-04-01 06:42:57",
                endTime: "2018-04-01",
                zone: "B",
                isValid: false
              },
              {
                customerId: "CE1171",
                startTime: "2018-04-01 09:52:36",
                endTime: "2018-04-01",
                zone: "A",
                isValid: false
              }
            ]);
  
            done();
          })
        );
      });
    });
  });
});
