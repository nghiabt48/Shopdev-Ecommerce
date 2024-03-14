'use strict';
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000
const countConnection = () => {
  const numConnections = mongoose.connections.length;
  console.log("Number of connections: " + numConnections);
}
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Limit maximum connections based on number of cores
    // E.g: each core can handle up to 5 connections
    const maxConnections = numCores * 5;
    console.log("Active connections: " + numConnections);
    console.log("Memory usage: "+ memoryUsage / 1024 / 1024 + 'MB')
    if(numConnections > maxConnections){
      console.log("Connection overloaded!");
    }
  }, _SECONDS)
}
module.exports = { countConnection, checkOverload }