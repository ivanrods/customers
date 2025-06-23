import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import Contact from "../models/Contact";

class ContactsController {
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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;

    let where = { customer_id: req.params.customerId };
    let order = [];

    if (name) {
      where.name = { [Op.iLike]: name };
    }

    if (email) {
      where.email = { [Op.iLike]: email };
    }

    if (status) {
      where.status = {
        [Op.in]: status.split(",").map((s) => s.toUpperCase()),
      };
    }

    if (createdAfter || createdBefore) {
      where.createdAt = {};
      if (createdAfter) where.createdAt[Op.gte] = parseISO(createdAfter);
      if (createdBefore) where.createdAt[Op.lte] = parseISO(createdBefore);
    }

    if (updatedAfter || updatedBefore) {
      where.updatedAt = {};
      if (updatedAfter) where.updatedAt[Op.gte] = parseISO(updatedAfter);
      if (updatedBefore) where.updatedAt[Op.lte] = parseISO(updatedBefore);
    }

    if (sort) {
      order = sort.split(",").map((item) => item.split(":"));
    }

    const data = await Contact.findAll({
      where,
      order,
      limit,
      offset: limit * (page - 1),
    });

    return res.json(data);
  }

  async show(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      attributes: { exclude: ["customer_id", "customerId"] },
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res.json(contact);
  }

  async create(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      status: Yup.string().uppercase(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: "Validation failed", messages: err.errors });
    }

    const contact = await Contact.create({
      customer_id: req.params.customerId,
      ...req.body,
    });

    return res.status(201).json(contact);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      status: Yup.string().uppercase(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: "Validation failed", messages: err.errors });
    }

    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    await contact.update(req.body);

    return res.json(contact);
  }

  async destroy(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    await contact.destroy();

    return res.status(204).send();
  }
}

export default new ContactsController();
