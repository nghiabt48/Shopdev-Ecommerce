'use strict';

const Logger = require("../loggers/discord.log.v2");

// const pushLogDiscord = async (req, res, next) => {
//   try{
//     Logger.pushLogToDiscord(`This is ${req.get('host')}`)
//     return next();
//   } catch(err){
//     next(err);
//   }
// }
// module.exports = {
//   pushLogDiscord
// }