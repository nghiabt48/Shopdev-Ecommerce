const amqp = require('amqplib');
const runProducer = async() => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test'
    await channel.assertQueue(queueName, {
      durable: true,
    })
    channel.sendToQueue(queueName, Buffer.from('Hello from RabbitMQ'))
  } catch (error) {
    console.error(error)
  }
}
runProducer().catch(err => console.error(err))