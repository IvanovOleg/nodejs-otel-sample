const { tracer } = require('./tracing')
const { Kafka, logLevel } = require('kafkajs')
const { countAllMessages } = require('./metrics')
const { insertEmployee } = require('./database')

const kafka = new Kafka({
  clientId: 'consumer',
  brokers: ['kafka:9092']
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'staff', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      insertEmployee(JSON.parse(message.value.toString()).name,
        JSON.parse(message.value.toString()).last_name,
        JSON.parse(message.value.toString()).position);
      countAllMessages();
    },
  })
}

run().catch(console.error)
