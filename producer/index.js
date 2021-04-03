const { tracer } = require ('./trace')
const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer',
  brokers: ['kafka:9092'],
  logLevel: logLevel.DEBUG
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect()
  await producer.send({
    topic: 'staff',
    messages: [
      { value: "{'name': 'Oleg', 'last_name': 'Ivanov', 'position': 'devops'}" }
    ]
  })
  await producer.disconnect()
}

run().catch(console.error)
