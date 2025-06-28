import * as Yup from "yup";
import { Op } from "sequelize";
import { parseISO } from "date-fns";
import User from "../models/User";
import WellcomeEmailJob from "../jobs/WellcomeEmailJob";
import Queue from "../../lib/Queue";

class UsersController {
    async index(req, res) {
        const {
            name,
            email,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort,
        } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 25;

        const where = {};
        const order = [];

        if (name) {
            where.name = { [Op.iLike]: `%${name}%` };
        }

        if (email) {
            where.email = { [Op.iLike]: `%${email}%` };
        }

        if (createdAfter || createdBefore) {
            where.createdAt = {};
            if (createdAfter) where.createdAt[Op.gte] = parseISO(createdAfter);
            if (createdBefore)
                where.createdAt[Op.lte] = parseISO(createdBefore);
        }

        if (updatedAfter || updatedBefore) {
            where.updatedAt = {};
            if (updatedAfter) where.updatedAt[Op.gte] = parseISO(updatedAfter);
            if (updatedBefore)
                where.updatedAt[Op.lte] = parseISO(updatedBefore);
        }

        if (sort) {
            sort.split(",").forEach((item) => {
                const [field, direction = "ASC"] = item.split(":");
                order.push([field, direction.toUpperCase()]);
            });
        }

        const data = await User.findAll({
            attributes: { exclude: ["password", "password_hash"] },
            where,
            order,
            limit,
            offset: limit * (page - 1),
        });

        return res.json(data);
    }

    async show(req, res) {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password", "password_hash"] },
        });
        if (!user) {
            return res.status(404).json({});
        }
        const { id, name, email, createdAt, updatedAt } = user;

        return res.json({ id, name, email, createdAt, updatedAt });
    }

    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8),
            passwordConfirmation: Yup.string().when(
                "password",
                (password, field) =>
                    password
                        ? field.required().oneOf([Yup.ref("password")])
                        : field,
            ),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Erro validate schima." });
        }

        const { id, name, email, file_id, createdAt, updatedAt } =
            await User.create(req.body);


        await Queue.add(WellcomeEmailJob.key, { name, email });
        
        return res
            .status(201)
            .json({ id, name, file_id, email, createdAt, updatedAt });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(8),
            password: Yup.string()
                .min(8)
                .when("oldPassword", (oldPassword, field) =>
                    oldPassword ? field.required() : field,
                ),
            passwordConfirmation: Yup.string().when(
                "password",
                (password, field) =>
                    password
                        ? field
                              .required()
                              .oneOf(
                                  [Yup.ref("password")],
                                  "Passwords must match",
                              )
                        : field,
            ),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            return res
                .status(400)
                .json({ error: "Validation failed", messages: err.errors });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { oldPassword, password } = req.body;

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res
                .status(401)
                .json({ error: "Old password does not match" });
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (password) user.password = password;

        await user.save();

        const { id, name, email, file_id, createdAt, updatedAt } = user;

        return res
            .status(200)
            .json({ id, name, email, file_id, createdAt, updatedAt });
    }

    async destroy(req, res) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.destroy();
        return res.status(200).json();
    }
}

export default new UsersController();
