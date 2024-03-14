const dev = {
  app: {
    port: process.env.DEV_PORT || 3000
  },
  db: {
    host: process.env.DEV_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'MoviesDev'
  }
}
const prod = {
  app: {
    port: process.env.PROD_PORT || 3000
  },
  db: {
    host: process.env.PROD_HOST || 'localhost',
    port: process.env.PROD_DB_PORT || 27017,
    name: process.env.PROD_DB_NAME || 'MoviesProd'
  }
}
const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]