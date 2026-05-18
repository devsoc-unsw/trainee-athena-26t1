import argon2 from "argon2";
import dotenv from "dotenv";
import User from "../src/models/Auth.js";
import { randomUUID } from "crypto";

dotenv.config();

export async function createUser(email, password) {
	if (password.length < 8 || !(/[a-z]/.test(password)) || !(/[A-Z]/.test(password))) {
		throw new Error("Password Invalid");
	}

	const hashedPassword = await argon2.hash(password);
	return {
		userId: randomUUID(),
		email: email.trim().toLowerCase(),
		password: hashedPassword,
		savedRecipes: [],
	};
}

export async function register(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
		if (existingUser) {
			return res.status(409).json({ error: "Email already registered" });
		}

		const userData = await createUser(email, password);
		const newUser = await User.create(userData);

		return res.status(201).json({
			userId: newUser.userId,
			email: newUser.email,
		});
	} catch (error) {
		if (error.message === "Password Invalid") {
			return res.status(400).json({ error: error.message });
		}
		if (error.code === 11000) {
			return res.status(409).json({ error: "Email already registered" });
		}
		return res.status(500).json({ error: error.message });
	}
}
