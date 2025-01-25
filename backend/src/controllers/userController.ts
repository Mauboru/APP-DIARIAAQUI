import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(404).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      'sua_chave_secreta',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login bem-sucedido.',
      token: token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, phone_number, user_type } = req.body;

    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este e-mail já está registrado.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password_hash,
      phone_number,
      user_type,
    });

    await client.messages.create({
      body: `Novo cadastro: ${newUser.name} (${newUser.email}) com o tipo de usuário ${newUser.user_type}`,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+554184987049',
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Erro no cadastro do usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getUserData = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token ausente.' });
    }

    const decoded: any = jwt.verify(token, 'sua_chave_secreta');
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const { password_hash, id, createdAt, updatedAt, ...userData } = user.toJSON();

    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};
