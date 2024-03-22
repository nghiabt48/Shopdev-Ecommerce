'use strict';

const redis = require('redis');
const { promisify } = require('util');
const { reserveInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient()
const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cart) => {
  const key = `lock_v2024${productId}`
  const retryTimes = 10
  const timeout = 3000
  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key, ai giu key thi duoc thanh toan
    const result = await setnxAsync(key, timeout)
    if(result === 1) {
      // thao tac voi inventory
      const isReserved = await reserveInventory({
        productId, quantity, cartId
      })
      console.log(isReserved.modifiedCount)
      if(isReserved.modifiedCount) {
        await pexpire(key, timeout)
        return key
      }
      return null
    }
    else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    
  }
}
const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}
module.exports = {
  acquireLock,
  releaseLock
}