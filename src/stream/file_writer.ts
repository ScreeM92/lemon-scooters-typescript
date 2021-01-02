import { Writable, WritableOptions } from "stream";
import fs from "fs";
import moment from "moment";
import JSONStream from "JSONStream";
import { getRidesPath, getErrorsPath } from "../config/paths";

class FileWriter extends Writable {
  ridesFileWriter: NodeJS.ReadWriteStream;
  errorsFileWriter: NodeJS.ReadWriteStream;

  constructor(options: WritableOptions = {}) {
    super({ objectMode: true, ...options });

    this.ridesFileWriter = JSONStream.stringify("[", ",", "]");
    this.errorsFileWriter = JSONStream.stringify("[", ",", "]");

    const timestamp = moment().unix();
    this.ridesFileWriter.pipe(fs.createWriteStream(getRidesPath(timestamp)));
    this.errorsFileWriter.pipe(fs.createWriteStream(getErrorsPath(timestamp)));
  }

  _write(chunk: any, encoding: string, callback: Function) {
    const isValid = chunk.isValid;
    delete chunk.isValid;

    if (isValid) {
      this.ridesFileWriter.write(chunk);
    } else {
      this.errorsFileWriter.write(chunk);
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