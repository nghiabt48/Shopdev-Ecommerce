const amqp = require('amqplib');
const runConsumer = async() => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    const queueName = 'test'
    await channel.assertQueue(queueName, {
      durable: true,
    })
    channel.consume(queueName, (message) => {
      console.log(`Receive message: ${message.content.toString()}`)
    }, {
      noAck: true
    })
  } catch (error) {
    console.error(error)
  }
}
runConsumer().catch(err => console.error(err))