const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');

const collectorOptions = {
  serviceName: 'consumer-service'
};

// Create and configure NodeTracerProvider
const traceProvider = new NodeTracerProvider({
  // be sure to disable old plugin
  plugins: {
    kafkajs: { enabled: false, path: 'opentelemetry-plugin-kafkajs' }
  }
});

const exporter = new CollectorTraceExporter(collectorOptions);
traceProvider.addSpanProcessor(new SimpleSpanProcessor(exporter));
traceProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

traceProvider.register()

registerInstrumentations({
  traceProvider,
  instrumentations: [
    new KafkaJsInstrumentation({
      // see under for available configuration
    })
  ]
});

const tracer = opentelemetry.trace.getTracer('consumer-service');

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
