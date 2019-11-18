/* eslint-disable no-unused-vars */
import path from 'path'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
const dotenv = require('dotenv-safe')
dotenv.load({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example')
});

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.HTTP_PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    defaultEmail: 'no-reply@gamepen.io',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    },
    ssl: {
      keyFile: process.env.SSL_KEY_FILE,
      certFile: process.env.SSL_CERT_FILE,
      passphrase: process.env.SSL_PASSPHRASE,
      port: process.env.HTTPS_PORT || 9000
    }
  },
  test: {
    mongo: {
      uri: 'mongodb://localhost/super-mini-games-server-test',
      options: {
        debug: false
      }
    }
  },
  development: {
    mongo: {
      uri: 'mongodb://localhost/super-mini-games-server-dev',
      options: {}
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.HTTP_PORT || 8080,
    mongo: {
      uri: process.env.MONGO_DB_URI || 'mongodb://localhost/super-mini-games-server',
      options: {
        debug: true
      }
    }
  }
}

const e = Object.assign({}, config.all, config[config.all.env]);

console.log('Startup with Settings', JSON.stringify(e));
module.exports = e;
export default module.exports
