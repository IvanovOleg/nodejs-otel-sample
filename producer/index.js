const { tracer } = require ('./trace')
const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();

const message = {
  name: 'Oleg',
  last_name: 'Ivanov',
  position: 'devops'
}

const run = async () => {
  await producer.connect()
  await producer.send({
    topic: 'staff',
    messages: [
      { value: JSON.stringify(message) }
    ]
  })
  await producer.disconnect()
}

run().catch(console.error)
