import express from 'express'
//import forceSSL from 'express-force-ssl'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../../config'

export default (apiRoot, routes) => {
  const app = express()

  /* istanbul ignore next */
  if (env === 'production') {
    // app.set('forceSSLOptions', {
    //   enable301Redirects: false,
    //   trustXFPHeader: true
    // })
    // app.use(forceSSL)
  }

  var corsOptions = {
    origin: function (origin, callback) {
      if (['http://localhost:8080', 'http://www.supermini.games'].indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`))
      }
    },
    credentials: true
  }

  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors(corsOptions))
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use('/', routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  return app
}
