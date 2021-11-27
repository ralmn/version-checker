import { NodeSDK, tracing } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
// import { ExpressPlugin } from "@opentelemetry/plugin-express";

let traceExporter : tracing.SpanExporter = new tracing.InMemorySpanExporter();

if(process.env.OTLP_HTTP_URL) {
    const collectorOptions = {
        url: process.env.OTLP_HTTP_URL, // url is optional and can be omitted - default is http://localhost:55681/v1/traces
        headers: {}, // an optional object containing custom headers to be sent with each request
        concurrencyLimit: 10, // an optional limit on pending requests
      };
    traceExporter =  new OTLPTraceExporter(collectorOptions);
}


const sdk = new NodeSDK({
    traceExporter: traceExporter,
    instrumentations: [
        (getNodeAutoInstrumentations() as any ),
        new TypeormInstrumentation(),
        {
            plugins: {
              express: {
                enabled: true,
                path: '@opentelemetry/plugin-express',
              }
            }
          },
    ] ,
});

sdk.start()
    .then(() => {
        console.log('Tracing started');
    })
    .catch(e => {
        console.log("Error on tracing", e.message);
        console.log(e);
    });
