"use strict";

import { Response, Request } from "express";
import RideValidator from "../stream/ride_validator";
import FileWriter from "../stream/file_writer";
import RideCalculator from "../stream/ride_calculator";
import Logger from "../util/logger";
import csv from "fast-csv";
import ScooterService from "../services/scooter.service";
import ElasticSearchService from "../services/elasticsearch.service";

/**
 * Execute the stream.
 * @route GET /api/execute-stream
 */
export const executeStream = (req: Request, res: Response) => {
    Logger.info("Running ...");

    Promise.all([ScooterService.getRate(), ScooterService.getRidesCsv()])
    .then(([{ data: priceRate }, { data: fileReadStream }]) => {
        const csvParser = csv({ headers: true, trim: true });

        fileReadStream
            .pipe(csvParser)
            .pipe(new RideValidator())
            .pipe(new RideCalculator(priceRate))
            .pipe(new FileWriter());

        Logger.info("... End");
        res.json({success: true});
    })
    .catch(error => {
        Logger.error(error.toString());
        res.json({success: false});
    });
};

/**
 * Search valid rides.
 * @route GET /api/searchRides
 */
export const searchRides = async (req: Request, res: Response) => {
    const options = { index: "rides123", type: "rides_list" } as Record<string, string>;

    if (req.query["q"]) {
        options.q = req.query["q"] as string; 
    }
    const response = await ElasticSearchService.search(options);
    
    res.send(response);
};

/**
 * Search invalid rides.
 * @route GET /api/searchErrors
 */
export const searchErrors = async (req: Request, res: Response) => {
    const options = { index: "errors123", type: "errors_list" } as Record<string, string>;

    if (req.query["q"]) {
        options.q = req.query["q"] as string; 
    }
    const response = await ElasticSearchService.search(options);
    
    res.send(response);
};