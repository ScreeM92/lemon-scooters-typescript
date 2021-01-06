import { Writable, WritableOptions } from "stream";
import fs from "fs";
import moment from "moment";
import JSONStream from "JSONStream";
import { getRidesPath, getErrorsPath } from "../config/paths";
import ElasticSearchService from "../services/elasticsearch.service";
import { basename } from "path";
import { ElasticSearchEnum } from "../common/enums/elasticsearch.enum";

class FileWriter extends Writable {
  ridesFileWriter: NodeJS.ReadWriteStream;
  errorsFileWriter: NodeJS.ReadWriteStream;

  ridesPath: string;
  errorsPath: string;
  timestamp: number;

  constructor(options: WritableOptions = {}) {
    super({ objectMode: true, ...options });

    this.ridesFileWriter = JSONStream.stringify("[", ",", "]");
    this.errorsFileWriter = JSONStream.stringify("[", ",", "]");

    this.timestamp = moment().unix();
    this.ridesPath = getRidesPath(this.timestamp);
    this.errorsPath = getErrorsPath(this.timestamp);
    this.ridesFileWriter.pipe(fs.createWriteStream(this.ridesPath));
    this.errorsFileWriter.pipe(fs.createWriteStream(this.errorsPath));
  }

  async _write(chunk: any, encoding: string, callback: Function) {
    const isValid = chunk.isValid;
    delete chunk.isValid;

    if (isValid) {
      this.ridesFileWriter.write(chunk);
      // make it async when there is a cron
      await ElasticSearchService.addDocument({index: ElasticSearchEnum.RIDES_INDEX, type: ElasticSearchEnum.RIDES_TYPE, body: { fileName: basename(this.ridesPath), ...chunk }});
    } else {
      this.errorsFileWriter.write(chunk);
      // make it async when there is a cron
      await ElasticSearchService.addDocument({index: ElasticSearchEnum.ERRORS_INDEX, type: ElasticSearchEnum.ERRORS_TYPE, body: { fileName: basename(this.errorsPath), ...chunk }});
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