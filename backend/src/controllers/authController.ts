import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import type { Request, Response } from "express";

import { pool } from "../config/database";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  try {
    const {
      name,
      email,
      password,
      preferences = {
        vegetarian: false,
        glutenFree: false,
        lactoseFree: false,
      },
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Já existe um usuário com este e-mail.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    await pool.query(
      `
      INSERT INTO users (
        id, name, email, password_hash,
        vegetarian, gluten_free, lactose_free
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        userId,
        name,
        email,
        passwordHash,
        preferences.vegetarian ?? false,
        preferences.glutenFree ?? false,
        preferences.lactoseFree ?? false,
      ]
    );

    const accessToken = generateAccessToken({ userId, email });
    const refreshToken = generateRefreshToken({ userId, email });

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      userId,
    ]);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      user: {
        id: userId,
        name,
        email,
        preferences,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao cadastrar usuário.",
      error,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios.",
      });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Credenciais inválidas.",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Credenciais inválidas.",
      });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferences: {
          vegetarian: user.vegetarian,
          glutenFree: user.gluten_free,
          lactoseFree: user.lactose_free,
        },
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao realizar login.",
      error,
    });
  }
}