import request from "supertest";
import app from "../../src/app";
import { getRidesPath, getErrorsPath } from "../../src/config/paths";
import moment from "moment";
import fs from 'fs';

describe("GET /api/execute-stream", () => {
    it("should return 200 OK", async (done: jest.DoneCallback) => {
        const timestamp = moment().unix();

        const response: request.Response = await request(app).get("/api/execute-stream");
        expect(response.body).toEqual({ success: true });
        expect(response.status).toBe(200);

        const ridesPath = getRidesPath(timestamp);
        const errorsPath = getErrorsPath(timestamp);

        expect(fs.existsSync(ridesPath)).toBeTruthy();
        expect(fs.existsSync(errorsPath)).toBeTruthy();

        // delete created files
        fs.unlinkSync(ridesPath);
        fs.unlinkSync(errorsPath);

        done();
    });
});
