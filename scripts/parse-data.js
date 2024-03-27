import { Readable } from 'node:stream';
import Papa from 'papaparse';

function parseData(data) {
  return Papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => {
      return value !== '' ? value : null;
    },
  });
}

function parseDataStream(data) {
  const stream = new Readable({ objectMode: true });
  stream._read = () => {
  };
  Papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => {
      return value !== '' ? value : null;
    },
    step: (result) => {
      stream.push(result.data);
    },
    complete: () => {
      stream.push(null);
    },
    error: (err) => {
      stream.emit('error', err);
    },
  });
  return stream;
}

export {
  parseData,
  parseDataStream,
};
