module.exports = {
  apps : [{
    name: "SketchGames Server",
    script: "/var/www/sketch.games/server/src/index.js",
    env: {
      HTTP_PORT: 11002,
      HTTPS_PORT: 11002,
      NODE_ENV: 'production',
      MONGO_DB_URI: 'mongodb://ec2-13-59-48-224.us-east-2.compute.amazonaws.com:10017',
      SSL_KEY_FILE: '/etc/certs/sketch.games.key',
      SSL_CERT_FILE: '/etc/certs/sketch_games_chain.crt'
    }
  }]
};