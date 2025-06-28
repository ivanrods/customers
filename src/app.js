import "dotenv/config";
import express from "express";
import routes from "./routes";
import Youch from "youch";

import "./database";

//import authMiddleware from './app/middlewares/auth'

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.exeptionHandler()
    }

    middlewares() {
        this.server.use(express.json());
        //this.server.use(authMiddleware)
    }

    routes() {
        this.server.use(routes);
    }
    exeptionHandler() {
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === "development") {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }
            return res.status(500).json(err, "Erro server");
        });
    }
}

export default new App().server;
