import "reflect-metadata";
import * as express from "express";
import { json as jsonBodyParser } from "body-parser";
import { mainRouter } from "./routes";
import { createConnection } from "typeorm";
import { loadConfig } from "./config";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9999;

const app = express();

app.use(jsonBodyParser());
app.use('/', mainRouter);


async function main() {
    await loadConfig();

    await createConnection();

    app.listen(PORT, () => {
        console.log(`Listen on port ${PORT}`)
    });
}

main().then(() => {});