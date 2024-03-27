const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient()
    this.publisher = Redis.createClient()
  }
  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) reject(err)
        else resolve(reply)
      })
    })
  }
  subscribe(channel, callback) {
    this.subscriber.subscribe(channel)
    this.subscriber.on('message', (subscribeChannel, message) => {
      if(channel === subscribeChannel) {
        callback(channel, message)
      }
    })
  }
}
module.exports = new RedisPubSubService()