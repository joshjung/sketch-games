module.exports = {
  apps : [{
    name: "GamePen Server",
    script: "./server/src/index.js",
    env: {
      HTTP_PORT: 11002,
      HTTPS_PORT: 11002,
      NODE_ENV: 'production',
      MONGO_DB_URI: 'mongodb://ec2-13-59-48-224.us-east-2.compute.amazonaws.com:10017/gamepen',
      SSL_KEY_FILE: '/home/ubuntu/certs/gamepen.joshjung.com.key',
      SSL_CERT_FILE: '/home/ubuntu/certs/gamepen_joshjung_com.crt'
    }
  }]
};