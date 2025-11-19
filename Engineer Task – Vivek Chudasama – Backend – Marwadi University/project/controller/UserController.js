const AppDataSource = require("../data-source");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { JWT_SECRET } = require("../middleware/auth");

class UserController {

    // 1. Registration API
    static register = async (req, res) => {
        const userRepository = AppDataSource.getRepository("User");
        const { name, email, password, role, phone, city, country } = req.body;

        // Validation Schema
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid("admin", "staff").required(),
            phone: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if email exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) return res.status(409).send("Email already in use");

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const newUser = userRepository.create({
                name, email, password: hashedPassword, role, phone, city, country
            });
            await userRepository.save(newUser);
            return res.status(201).send("User created");
        } catch (e) {
            return res.status(500).send("Error creating user");
        }
    };

    // 2. Login API
    static login = async (req, res) => {
        const { email, password } = req.body;
        if (!(email && password)) return res.status(400).send("Email and password required");

        const userRepository = AppDataSource.getRepository("User");
        let user;

        try {
            // We must explicitly select password because select: false is set in schema
            user = await userRepository.findOne({
                where: { email },
                select: ["id", "email", "password", "role"]
            });
        } catch (error) {
            return res.status(401).send("Login failed");
        }

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send("Incorrect email or password");
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.send({ token });
    };

    // 3. List Users (Admin Only + Search/Filter)
    static listAll = async (req, res) => {
        const userRepository = AppDataSource.getRepository("User");
        const { search, country } = req.query;

        const query = userRepository.createQueryBuilder("user");

        // Filter by country
        if (country) {
            query.andWhere("user.country = :country", { country });
        }

        // Search by Name OR Email
        if (search) {
            query.andWhere(
                "(user.name LIKE :search OR user.email LIKE :search)",
                { search: `%${search}%` }
            );
        }

        try {
            const users = await query.getMany();
            return res.send(users);
        } catch (e) {
            return res.status(500).send("Error fetching users");
        }
    };

    // 4. User Details (Role Based)
    static getOneById = async (req, res) => {
        const id = parseInt(req.params.id);
        const { userId, role } = res.locals.jwtPayload;

        // Logic: Admin can see anyone. Staff can only see themselves.
        if (role !== "admin" && userId !== id) {
            return res.status(403).send("Access Denied: You can only view your own data.");
        }

        const userRepository = AppDataSource.getRepository("User");
        try {
            const user = await userRepository.findOne({ where: { id } });
            if (!user) return res.status(404).send("User not found");
            return res.send(user);
        } catch (error) {
            return res.status(500).send("Error retrieving user");
        }
    };
}

module.exports = UserController;