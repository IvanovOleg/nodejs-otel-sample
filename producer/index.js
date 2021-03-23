const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');

const collectorOptions = {
  serviceName: 'producer-service'
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

const tracer = opentelemetry.trace.getTracer('producer-service');

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
      { value: 'Hello Oleg' }
    ]
  })
  await producer.disconnect()
}

run().catch(console.error)
