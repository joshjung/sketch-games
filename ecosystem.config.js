module.exports = {
  apps : [{
    name: "GamePen Server",
    script: "./server/src/index.js",
    env: {
      SENDGRID_KEY: '***REMOVED***',
      MASTER_KEY: 'somemasterkey',
      JWT_SECRET: 'somejwtsecret'
    }
  }]
}