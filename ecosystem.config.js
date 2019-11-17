module.exports = {
  apps : [{
    name: "GamePen Server",
    script: "./server/src/index.js",
    env: {
      SENDGRID_KEY: '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',
      MASTER_KEY: 'somemasterkey',
      JWT_SECRET: 'somejwtsecret'
    }
  }]
}