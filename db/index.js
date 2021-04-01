const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector');
const { MssqlInstrumentation } = require('opentelemetry-instrumentation-mssql');

const collectorOptions = {
  serviceName: 'db-service'
};

// Create and configure NodeTracerProvider
const traceProvider = new NodeTracerProvider({
  // be sure to disable old plugin
  plugins: {
    sequelize: { enabled: false, path: 'opentelemetry-plugin-mssql' }
  }
});

const exporter = new CollectorTraceExporter(collectorOptions);
traceProvider.addSpanProcessor(new SimpleSpanProcessor(exporter));
traceProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

traceProvider.register();

registerInstrumentations({
  traceProvider,
  instrumentations: [
    new MssqlInstrumentation({
      // see under for available configuration
      ignoreOrphanedSpans: false
    })
  ]
});

const tracer = opentelemetry.trace.getTracer('db-service');

const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Sjw2pBufpvGfh6*V',
  server: 'localhost',
  database: 'staff',
  options: {
    enableArithAbort: true
  }
}

sql.on('error', err => {
  console.log(err);
})

sql.connect(config).then(pool => {
  // Query

  return pool.request()
    .input('input_parameter', sql.VarChar(50), 'Oleg')
    .query('select * from employees where name = @input_parameter')
}).then(result => {
  console.dir(result)
}).catch(err => {
  console.log(err);
});
