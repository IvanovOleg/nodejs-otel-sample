const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');
const { MssqlInstrumentation } = require('opentelemetry-instrumentation-mssql');

const collectorOptions = {
  serviceName: 'consumer-service'
};

// Create and configure NodeTracerProvider
const traceProvider = new NodeTracerProvider({
  // be sure to disable old plugin
  plugins: {
    kafkajs: { enabled: false, path: 'opentelemetry-plugin-kafkajs' },
    sequelize: { enabled: false, path: 'opentelemetry-plugin-mssql' }
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
    }),
    new MssqlInstrumentation({
      // see under for available configuration
      ignoreOrphanedSpans: false
    })
  ]
});

tracer = opentelemetry.trace.getTracer('consumer-service');
