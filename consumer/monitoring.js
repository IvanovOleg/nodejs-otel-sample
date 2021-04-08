const { CollectorMetricExporter } = require('@opentelemetry/exporter-collector');
const { MeterProvider } = require('@opentelemetry/metrics');

const metricExporter = new CollectorMetricExporter({
  serviceName: 'consumer-service',
});

// Initialize the Meter to capture measurements in various ways.
const meter = new MeterProvider({
  exporter: metricExporter,
  interval: 30000,
}).getMeter('your-meter-name');

module.exports.meter = meter;
