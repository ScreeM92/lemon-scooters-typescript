import RideValidator from "../../src/stream/ride_validator";
import StreamTest from "streamtest";

const validRides = [{"customerId":"LA1169","startTime":"2018-04-01 06:42:57","endTime":"2018-04-01 07:15:50","zone":"B"}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01 11:03:15","zone":"A"}, {"customerId":"NP1443","startTime":"2018-04-01 21:12:33","endTime":"2018-04-01 21:53:38","zone":"C"}];
const validAndInvalidRides = [{"customerId":"LA1169","startTime":"2018-04-01 06:42:57","endTime":"2018-04-01","zone":"B"}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01 11:03:15","zone":"A"}];
const invalidRides = [{"customerId":"LA1169","startTime":"2018-04-01 06:42:57","endTime":"2018-04-01","zone":"B"}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01","zone":"A"}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","zone":"A"},{"customerId":"NP1443","startTime":"2018-04-01 21:12:33","endTime":"2018-04-01 21:53:38"},{"customerId":"TEST13","startTime":"2018-04-01 21:12:33","endTime":"2018-04-01 21:53:38", "zone":"C",}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01 11:03:15","zone":"-"}];

describe("RideValidator", () => {

  StreamTest.versions.forEach((version) => {
    describe("for " + version + " streams", () => {
 
      it("should validate that every ride is correct", (done: jest.DoneCallback) => {
        StreamTest[version].fromObjects(validRides)
          .pipe(new RideValidator())
          .pipe(StreamTest[version].toObjects((err, output) => {
            if(err) {
              done(err);
            }

            expect(output).toEqual([
                {
                    isValid: true,
                    customerId: "LA1169",
                    startTime: "2018-04-01 06:42:57",
                    endTime: "2018-04-01 07:15:50",
                    zone: "B"
                },
                {
                    isValid: true,
                    customerId: "CE1171",
                    startTime: "2018-04-01 09:52:36",
                    endTime: "2018-04-01 11:03:15",
                    zone: "A"
                },
                {
                    isValid: true,
                    customerId: "NP1443",
                    startTime: "2018-04-01 21:12:33",
                    endTime: "2018-04-01 21:53:38",
                    zone: "C"
                }
            ]);

            done();
          })
        );
      });

      it("should validate that one ride is correct and another is incorrect", (done: jest.DoneCallback) => {
        StreamTest[version].fromObjects(validAndInvalidRides)
          .pipe(new RideValidator())
          .pipe(StreamTest[version].toObjects((err, output) => {
            if(err) {
              done(err);
            }

            expect(output).toEqual([
                {
                    isValid: false,
                    customerId: "LA1169",
                    startTime: "2018-04-01 06:42:57",
                    endTime: "2018-04-01",
                    zone: "B"
                },
                {
                    isValid: true,
                    customerId: "CE1171",
                    startTime: "2018-04-01 09:52:36",
                    endTime: "2018-04-01 11:03:15",
                    zone: "A"
                }
            ]);

            done();
          })
        );
      });

      it("should validate that all rides are incorrect", (done: jest.DoneCallback) => {
        StreamTest[version].fromObjects(invalidRides)
          .pipe(new RideValidator())
          .pipe(StreamTest[version].toObjects((err, output) => {
            if(err) {
              done(err);
            }

            expect(output).toEqual([
                {
                    isValid: false,
                    customerId: "LA1169",
                    startTime: "2018-04-01 06:42:57",
                    endTime: "2018-04-01",
                    zone: "B"
                },
                {
                    isValid: false,
                    customerId: "CE1171",
                    startTime: "2018-04-01 09:52:36",
                    endTime: "2018-04-01",
                    zone: "A"
                },
                {
                    isValid: false,
                    customerId: "CE1171",
                    startTime: "2018-04-01 09:52:36",
                    zone: "A"
                },
                {
                    isValid: false,
                    customerId: "NP1443",
                    startTime: "2018-04-01 21:12:33",
                    endTime: "2018-04-01 21:53:38"
                },
                {
                    isValid: false,
                    customerId: "TEST13",
                    startTime: "2018-04-01 21:12:33",
                    endTime: "2018-04-01 21:53:38",
                    zone: "C"
                },
                {
                    isValid: false,
                    customerId: "CE1171",
                    startTime: "2018-04-01 09:52:36",
                    endTime: "2018-04-01 11:03:15",
                    zone: "-"
                }
            ]);

            done();
          })
        );
      });

    });
  });
});
