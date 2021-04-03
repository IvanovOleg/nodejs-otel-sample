const { tracer } = require ('./trace')
const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'consumer',
  brokers: ['kafka:9092'],
  logLevel: logLevel.DEBUG
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'staff', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        message,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)
