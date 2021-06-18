import express from "express";
import bodyParser from "body-parser";
import * as http from "http";
import * as socketio from "socket.io";
import path from "path";
import { config } from "dotenv";
import { ConnectionOptions, createConnection } from "typeorm";
import sslRedirect from "heroku-ssl-redirect";
import { routes } from "./routes/_routes";

// env
const envPath = path.join(__dirname, ".env");
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
/// todo

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
