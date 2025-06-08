const express = require("express");

const server = express();
server.use(express.json());

let customers = [
  {
    id: 1,
    name: "Dev samurai",
    site: "http://devsamurai.com",
  },
  {
    id: 2,
    name: "Dev gui",
    site: "http://devsamurai.com",
  },
  {
    id: 4,
    name: "Dev mario",
    site: "http://devsamurai.com",
  },
];

server.get("/customers", (req, res) => {
  return res.json(customers);
});

server.get("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const customer = customers.find((item) => item.id === id);
  const status = customer ? 200 : 400;

  console.log("GET :: /customers/:id",customer )

  return res.status(status).json(customer);
});

server.post("/customers", (req, res) => {
  const { name, site } = req.body;
  const id = customers[customers.length - 1].id + 1;

  const newCustomers = { id, name, site };

  customers.push(newCustomers);

  return res.status(201).json(newCustomers);
});

server.put("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, site } = req.body;

  const index = customers.findIndex((item) => item.id == id);

  const status = index >= 0 ? 200 : 404;
  if (index >= 0) {
    customers[index] = { id: parseInt(id), name, site };
  }
  return res.status(status).json(customers[index]);
});

server.delete("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = customers.findIndex((item) => item.id == id);
  const status = index >= 0 ? 200 : 404;
  if (index >= 0) {
    customers.splice(index, 1);
  }
  return res.status(status).json();
});

server.listen(3000);
