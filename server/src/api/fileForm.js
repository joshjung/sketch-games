import multiparty from 'multiparty';
import streamToBuf from 'stream-to-buf';

export default function(req, res, next) {
  return new Promise((resolve, reject) => {
    let fileCount = 0;
    let form = new multiparty.Form();

    let mp = req.multiparty = req.multiparty || {
      fields: {},
      files: [],
      errors: [],
      finishedParsing: false
    };

    form.on('error', function(err) {
      mp.errors.push(err);
      console.error('Error parsing form: ' + err.toString(), err.stack);
    });

    form.on('part', function(part) {
      streamToBuf(part, { maxSize: '1mb' }).then(buffer => {
        if (!part.filename) {
          mp.fields[part.name] = buffer.toString();
        }

        if (part.filename) {
          fileCount++;
          mp.files.push({
            contentType: part.headers['content-type'],
            filename: part.filename,
            buffer
          });
        }
      });

      part.on('error', function(err) {
        mp.errors.push(err);
        console.error('Error parsing part: ' + err.toString(), err.stack);
      });
    });

    form.on('close', function() {
      mp.finishedParsing = true;

      mp.files.forEach(file => {
        console.log(file.filename, file.byteCount);
      });

      resolve(mp);
    });

    form.parse(req);
  });
}
