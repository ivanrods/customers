import Customer from "../models/Customer";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import Contact from "../models/Contact";

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

class CustomersController {
    async index(req, res) {
        const {
            name,
            email,
            status,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort,
        } = req.query;

        const page = req.query.page || 1;
        const limit = req.query.limit || 25;

        let where = {};
        let order = [];

        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: name,
                },
            };
        }
        if (email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: email,
                },
            };
        }
        if (status) {
            where = {
                ...where,
                status: {
                    [Op.in]: status
                        .split(",")
                        .map((item) => item.toUpperCase()),
                },
            };
        }
        if (createdBefore) {
            where = {
                ...where,
                createdAt: {
                    [Op.gte]: parseISO(createdBefore),
                },
            };
        }
        if (createdAfter) {
            where = {
                ...where,
                createdAt: {
                    [Op.lte]: parseISO(createdAfter),
                },
            };
        }

        if (updatedBefore) {
            where = {
                ...where,
                updatedAt: {
                    [Op.gte]: parseISO(updatedBefore),
                },
            };
        }
        if (updatedAfter) {
            where = {
                ...where,
                updatedAt: {
                    [Op.lte]: parseISO(updatedAfter),
                },
            };
        }
        if (sort) {
            order = sort.split(",").map((item) => item.split(":"));
        }

        const data = await Customer.findAll({
            where,
            include: [
                {
                    model: Contact,
                    as: "contacts",
                    attributes: ["id", "status"],
                },
            ],
            order,
            limit,
            offset: limit * page - limit,
        });
        return res.json(data);
    }

    async show(req, res) {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({});
        }

        return res.json(customer);
    }
    async create(req, res) {
        const customer = await Customer.create(req.body);

        return res.status(201).json(customer);
    }
    update(req, res) {
        const id = parseInt(req.params.id);
        const { name, site } = req.body;

        const index = customers.findIndex((item) => item.id == id);

        const status = index >= 0 ? 200 : 404;
        if (index >= 0) {
            customers[index] = { id: parseInt(id), name, site };
        }
        return res.status(status).json(customers[index]);
    }
    destroy(req, res) {
        const id = parseInt(req.params.id);
        const index = customers.findIndex((item) => item.id === id);
        const status = index >= 0 ? 200 : 404;
        if (index >= 0) {
            customers.splice(index, 1);
        }
        return res.status(status).json();
    }
}

export default new CustomersController();
