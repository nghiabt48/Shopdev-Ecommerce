const amqp = require('amqplib');

async function consumerMessageOfOrder() {
  const connection = await amqp.connect('amqp://guest:guest@localhost')
  const channel = await connection.createChannel()
  const queueName = 'order-queue-message'
  await channel.assertQueue(queueName, {
    durable: true,
  })
  // ensure only 1 message is acked at a time
  channel.prefetch(1)

  channel.consume(queueName, msg => {
    const message = msg.content.toString()
  })
}

