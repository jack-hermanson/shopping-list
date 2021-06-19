import express from "express";
import bodyParser from "body-parser";
import * as http from "http";
import * as socketio from "socket.io";
import path from "path";
import { config } from "dotenv";
import { ConnectionOptions, createConnection } from "typeorm";
import sslRedirect from "heroku-ssl-redirect";
import { routes } from "./routes/_routes";
import { DbDialect } from "jack-hermanson-ts-utils";
import { models } from "./models/_models";
import { migrations } from "./migrations/_migrations";

// env
const envPath = path.join(__dirname, "..", ".env");
config({ path: envPath });

// express server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("port", process.env.PORT || 5000);

// ssl
console.log(`Environment: ${app.get("env")}`);
app.use(sslRedirect(["production"]));

// static
// todo

// routes
app.use("/api/accounts", routes.accounts);

// database
const databaseDialect = process.env.DATABASE_DIALECT as DbDialect;
console.log({ databaseDialect });
export const dbOptions: ConnectionOptions = {
    database: databaseDialect === "sqlite" ? "site.db" : "",
    type: databaseDialect,
    url: process.env.DATABASE_URL,
    entities: models,
    synchronize: false,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    migrationsRun: true,
    migrationsTableName: "migrations",
    migrations: migrations,
    cli: {
        migrationsDir: path.join(__dirname, "migrations"),
    },
};
createConnection(dbOptions)
    .then(connection => {
        console.log(
            `Connected to database with type: ${connection.options.type}.`
        );
    })
    .catch(error => console.error(error));

// http server and socket
const server = http.createServer(app);
const io = new socketio.Server({
    cors: {
        origin: "*",
    },
});
io.attach(server);
app.set("socketio", io);

// listen
server.listen(app.get("port"), () => {
    console.log(`Server is listening on port ${app.get("port")}.`);
});
