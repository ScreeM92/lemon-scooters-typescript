import request from "supertest";
import app from "../../src/app";
import { getRidesPath, getErrorsPath } from "../../src/config/paths";
import moment from "moment";
import fs from "fs";
import ElasticSearchService from '../../src/services/elasticsearch.service';
import ScooterService from '../../src/services/scooter.service';
import SpyInstance = jest.SpyInstance;

function sleep(ms: number): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}  

describe("GET /api/execute-stream", () => {
    it("should return 200 OK and successfully execute the stream", async (done: jest.DoneCallback) => {
        sleep(1001);

        const spyAddRideDoc: SpyInstance = jest.spyOn(ElasticSearchService, "addDocument").mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        });
        
        const response: request.Response = await request(app).get("/api/execute-stream");
        const timestamp = moment().unix();

        expect(response.body).toEqual({ success: true });
        expect(response.status).toBe(200);

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

    it("should return that executing the stream is not successfull because of error in getting the price rate data", async (done: jest.DoneCallback) => {
        sleep(1001);

        const spyGetRate: SpyInstance = jest.spyOn(ScooterService, "getRate").mockImplementation(() => {
            return new Promise((resolve, reject) => {
                reject("Server not responding");
            });
        });
        const spyGetRidesCsv: SpyInstance = jest.spyOn(ScooterService, "getRidesCsv").mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve({data: {}});
            });
        });

        const response: request.Response = await request(app).get("/api/execute-stream");

        expect(response.body).toEqual({ success: false });
        expect(response.status).toBe(200);

        // restore mocks
        spyGetRate.mockRestore();
        spyGetRidesCsv.mockRestore();

        done();
    });

    it("should return that executing the stream is not successfull because of error in getting the csv file with the rides", async (done: jest.DoneCallback) => {
        sleep(1001);

        const spyGetRate: SpyInstance = jest.spyOn(ScooterService, "getRate").mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve({data: [{
                    "zone": "A",
                    "price": 0.10,
                    "currency": "USD"
                  }]});
            });
        });
        const spyGetRidesCsv: SpyInstance = jest.spyOn(ScooterService, "getRidesCsv").mockImplementation(() => {
            return new Promise((resolve, reject) => {
                reject(true);
            });
        });

        const response: request.Response = await request(app).get("/api/execute-stream");

        expect(response.body).toEqual({ success: false });
        expect(response.status).toBe(200);

        // restore mocks
        spyGetRate.mockRestore();
        spyGetRidesCsv.mockRestore();

        done();
    });
});
