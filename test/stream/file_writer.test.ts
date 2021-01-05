import FileWriter from "../../src/stream/file_writer";
import StreamTest from "streamtest";
import { cloneDeep } from "lodash";
import moment from "moment";
import { getRidesPath, getErrorsPath } from "../../src/config/paths";
import fs from "fs";
import ElasticSearchService from "../../src/services/elasticsearch.service";
import SpyInstance = jest.SpyInstance;

const validRides = [{"customerId":"LA1169","startTime":"2018-04-01 06:42:57","endTime":"2018-04-01 07:15:50","zone":"B","price":9.9,"currency":"USD","minutes":33, isValid: true},{"customerId":"LX1703","startTime":"2018-04-01 07:23:27","endTime":"2018-04-01 07:37:25","zone":"A","price":2.8000000000000003,"currency":"USD","minutes":14, isValid: true},{"customerId":"GE1085","startTime":"2018-04-01 07:53:31","endTime":"2018-04-01 08:26:11","zone":"A","price":6.6000000000000005,"currency":"USD","minutes":33,isValid: true}];
const invalidRides = [{"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01 11:03:15","zone":"-", isValid: false}, {"customerId":"CE1171","startTime":"2018-04-01 09:52:36","endTime":"2018-04-01","zone":"A", isValid: false}];
const validAndInvalidRides = [...validRides, ...invalidRides];

function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

describe("FileWriter", () => {

  StreamTest.versions.forEach((version) => {
    describe("for " + version + " streams", () => {

      it("should create a file for valid rides and empty file for invalid rides", async (done: jest.DoneCallback) => {
        await sleep(1001);

        const spyAddRideDoc: SpyInstance = jest.spyOn(ElasticSearchService, "addDocument").mockImplementation(() => {
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        });
        const timestamp = moment().unix();
        StreamTest[version].fromObjects(cloneDeep(validRides))
            .pipe(new FileWriter())
            .on("finish", () => {
                const ridesPath = getRidesPath(timestamp);
                const errorsPath = getErrorsPath(timestamp);

                expect(fs.existsSync(ridesPath)).toBeTruthy();
                expect(fs.existsSync(errorsPath)).toBeTruthy();

                // delete created files
                fs.unlinkSync(ridesPath);
                fs.unlinkSync(errorsPath);

                // restore mocks
                spyAddRideDoc.mockRestore();

                done();
            });
      });

      it("should check if the data in the files is valid", async (done: jest.DoneCallback) => {
        await sleep(1001);

        const spyAddDoc: SpyInstance = jest.spyOn(ElasticSearchService, "addDocument").mockImplementation(() => {
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        });

        const timestamp = moment().unix();
        StreamTest[version].fromObjects(cloneDeep(validAndInvalidRides))
            .pipe(new FileWriter())
            .on("finish", () => {
                const ridesPath = getRidesPath(timestamp);
                const errorsPath = getErrorsPath(timestamp);
                const rides = JSON.parse(fs.readFileSync(ridesPath, "utf8"));
                const errors = JSON.parse(fs.readFileSync(errorsPath, "utf8"));

                const copyValidRides = cloneDeep(validRides);
                for(const ride of copyValidRides) {
                    delete ride.isValid;
                }
                expect(rides).toEqual(expect.arrayContaining(copyValidRides));
                expect(rides).toHaveLength(3);

                const copyInvalidRides = cloneDeep(invalidRides);
                for(const ride of copyInvalidRides) {
                    delete ride.isValid;
                }
                expect(errors).toEqual(expect.arrayContaining(copyInvalidRides));
                expect(errors).toHaveLength(2);

                // delete created files
                fs.unlinkSync(ridesPath);
                fs.unlinkSync(errorsPath);

                // restore mocks
                spyAddDoc.mockRestore();

                done();
            });
      });

    });
  });
});