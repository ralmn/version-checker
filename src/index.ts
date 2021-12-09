import "reflect-metadata";
import * as express from "express";
import { json as jsonBodyParser } from "body-parser";
import { mainRouter } from "./routes";
import { createConnection } from "typeorm";
import { loadConfig } from "./config";
import { addTraceId } from "./telemetry";
const all_routes = require('express-list-endpoints');

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9999;
const SHOW_ROUTES = false;

const app = express();

app.use(jsonBodyParser());
app.use(addTraceId);
app.use('/', mainRouter);


async function main() {
    await loadConfig();

    await createConnection();

    app.listen(PORT, () => {
        console.log(`Listen on port ${PORT}`)
        if(SHOW_ROUTES){
            console.table(all_routes(app));
        }
    });
}

main().then(() => {});