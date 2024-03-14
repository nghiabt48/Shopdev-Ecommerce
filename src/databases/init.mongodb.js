'use strict';
const mongoose = require('mongoose');

const connectString = `mongodb+srv://nghiabt48:lhgf@mycluster.hjfyqg1.mongodb.net/ShopDev`
class Database {
  constructor() {
    this.connect()
  }
  connect(type = 'mongodb') {
    if(1 === 1){
      mongoose.set('debug', true)
      mongoose.set('debug', {color: true})
    }
    mongoose.connect(connectString).then( _ => console.log("Database connect successful"))
  .catch(err => console.log("Error connecting to DB"))
  }

  static getInstance() {
    if(!Database.instance){
      Database.instance = new Database()
    }
    return Database.instance
  }
}
const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb