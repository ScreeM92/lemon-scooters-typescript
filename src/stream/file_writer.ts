import { Writable, WritableOptions } from "stream";
import fs from "fs";
import moment from "moment";
import JSONStream from "JSONStream";
import { getRidesPath, getErrorsPath } from "../config/paths";
import ElasticSearchService from "../services/elasticsearch.service";
import { basename } from 'path';

class FileWriter extends Writable {
  ridesFileWriter: NodeJS.ReadWriteStream;
  errorsFileWriter: NodeJS.ReadWriteStream;

  ridesPath: string;
  errorsPath: string;

  constructor(options: WritableOptions = {}) {
    super({ objectMode: true, ...options });

    this.ridesFileWriter = JSONStream.stringify("[", ",", "]");
    this.errorsFileWriter = JSONStream.stringify("[", ",", "]");

    const timestamp = moment().unix();
    this.ridesPath = getRidesPath(timestamp);
    this.errorsPath = getErrorsPath(timestamp);
    this.ridesFileWriter.pipe(fs.createWriteStream(this.ridesPath));
    this.errorsFileWriter.pipe(fs.createWriteStream(this.errorsPath));
  }

  _write(chunk: any, encoding: string, callback: Function) {
    const isValid = chunk.isValid;
    delete chunk.isValid;

    if (isValid) {
      this.ridesFileWriter.write(chunk);
      ElasticSearchService.addRideDocument({fileName: basename(this.ridesPath), ...chunk});
    } else {
      this.errorsFileWriter.write(chunk);
      ElasticSearchService.addErrorDocument({fileName: basename(this.errorsPath), ...chunk});
    }

    callback();
  }

  _final(callback: Function) {
    this.ridesFileWriter.end();
    this.errorsFileWriter.end();

    callback();
  }
}

export default FileWriter;