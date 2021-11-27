import opentelemetry, { diag, DiagConsoleLogger, DiagLogLevel, context } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/node";
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { BatchSpanProcessor } from '@opentelemetry/tracing'
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { getSpanContext } from "@opentelemetry/api/build/src/trace/context-utils";
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// import { ExpressPlugin } from "@opentelemetry/plugin-express";

let tracerProvider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'version-checker',
    }),
});



if (process.env.TRACING_LOG === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}
registerInstrumentations({
    tracerProvider: tracerProvider,
    instrumentations: [
        (getNodeAutoInstrumentations() as any),
        new TypeormInstrumentation(),
        // {
        //     plugins: {
        //         express: {
        //             enabled: true,
        //             path: '@opentelemetry/plugin-express',
        //         }
        //     }
        // },
        new ExpressInstrumentation(),
        new HttpInstrumentation()
    ]
});


if (process.env.JAEGER_ENDPOINT) {
    const options = {
        tags: [], // optional
        endpoint: process.env.JAEGER_ENDPOINT, // 'http://localhost:14268/api/traces'
        maxPacketSize: 65000 // optional
    }
    let traceExporter = new JaegerExporter(options);
    tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
}
if (process.env.OTLP_HTTP_URL) {
    const collectorOptions = {
        url: process.env.OTLP_HTTP_URL, // url is optional and can be omitted - default is http://localhost:55681/v1/traces
        headers: {}, // an optional object containing custom headers to be sent with each request
        concurrencyLimit: 10, // an optional limit on pending requests
    };
    let traceExporter = new OTLPTraceExporter(collectorOptions);
    tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
}


tracerProvider.register({
    propagator: new JaegerPropagator()
});


export const tracer = opentelemetry.trace.getTracer("version-checker");

export const addTraceId = (req, res, next) => {
    const spanContext = getSpanContext(context.active());
    if (spanContext) {
        req.traceId = spanContext.traceId;
        res.setHeader('vc-trace-id', spanContext.traceId)
        console.log(`path=${req.path} traceId=${spanContext.traceId}`);
    }
    next();
};
