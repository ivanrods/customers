import { Router } from "express";

import customers from "./app/controllers/CustomersController";
import contacts from "./app/controllers/ContactsController";
import users from "./app/controllers/userController";
import auth from './app/middlewares/auth'
import sessions from "./app/controllers/SessionsController";

const routes = new Router();
routes.post("/sessions", sessions.create);
routes.use(auth)

routes.get("/customers", customers.index);
routes.get("/customers/:id", customers.show);
routes.post("/customers", customers.create);
routes.put("/customers/:id", customers.update);
routes.delete("/customers/:id", customers.destroy);

routes.get("/users", users.index);
routes.get("/users/:id", users.show);
routes.post("/users", users.create);
routes.put("/users/:id", users.update);
routes.delete("/users/:id", users.destroy);

routes.get("/customers/:customerId/contacts", contacts.index);
routes.get("/customers/:customerId/contacts/:id", contacts.show);
routes.post("/customers/:customerId/contacts", contacts.create);
routes.put("/customers/:customerId/contacts/:id", contacts.update);
routes.delete("/customers/:customerId/contacts/:id", contacts.destroy);

export default routes;
