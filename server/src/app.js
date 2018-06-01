import http from 'http'
import { env, mongo, port, ip, apiRoot, ssl } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
import https from 'https';
import fs from 'fs';

let csrOptions = ssl.keyFile ? {
  key: fs.readFileSync(ssl.keyFile),
  cert: fs.readFileSync(ssl.certFile),
  passphrase: ssl.passphrase
} : undefined;

const app = express(apiRoot, api)

mongoose.connect(mongo.uri, { useMongoClient: true })
mongoose.Promise = Promise

setImmediate(() => {
  if (env === 'production') {
    if (!csrOptions) {
      console.error('Please provide SSL_KEY_FILE, SSL_KEY_CERT, SSL_PASSPHRASE (optional)');
      process.exit(1);
      return;
    }

    https.createServer(csrOptions, app)
      .listen(ssl.port, () => {
        console.log(`Supermini Games production SSL server started at https://localhost:${ssl.port}`, ip, env);
      });
  } else {
    const server = http.createServer(app);
    server.listen(port, ip, () => {
      console.log('Supermini Games server listening on http://%s:%d, in %s mode', ip, port, env)
    })
  }
});

export default app
