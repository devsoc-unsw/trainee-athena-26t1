import argon2 from "argon2";
import dotenv from "dotenv";
import User from "../src/models/Auth.js";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

dotenv.config();

const {
    JWT_ACCESS_SECRET = "dev",
    JWT_REFRESH_SECRET = "dev"
} = process.env;

function validatePassword(password) {
	if (password.length < 8 || !(/[a-z]/.test(password)) || !(/[A-Z]/.test(password))) {
		throw new Error("Password must be 8 characters long and contain at least one lowercase and one uppercase letter");
	}
}

export async function createUser(email, password) {
	validatePassword(password);

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

export async function login(req, res) {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		const user = await User.findOne({ email: email.trim().toLowerCase() });
		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}
		
		const isPasswordValid = await argon2.verify(user.password, password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const token = generateAccessToken(user.userId);

		return res.status(200).json({ userId: user.userId, email: user.email, accessToken: token });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

export function verifyAccessToken(token) {
	return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function generateAccessToken(userId) {
	return jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "7d" });
}

export async function changePassword(req, res) {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({ error: "Current and new password are required" });
		}

		const user = await User.findOne({ userId: req.userId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const isCurrentValid = await argon2.verify(user.password, currentPassword);
		if (!isCurrentValid) {
			return res.status(401).json({ error: "Current password is incorrect" });
		}

		validatePassword(newPassword);

		user.password = await argon2.hash(newPassword);
		await user.save();

		return res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
		if (error.message === "Password Invalid") {
			return res.status(400).json({ error: error.message });
		}
		return res.status(500).json({ error: error.message });
	}
}

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Authentication required" });
	}

	const token = authHeader.slice("Bearer ".length);

	try {
		const payload = verifyAccessToken(token);
		req.userId = payload.sub;
		next();
	} catch {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}