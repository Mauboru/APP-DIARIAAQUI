import { Request, Response } from "express";
import { Client } from "../models/Client";

// Controller para criação de cliente
export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const client = await Client.create({ name, email, phone });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente.' });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar clientes.' });
  }
};

// Controller para pegar um cliente específico
export const getClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente.' });
  }
};

// Controller para atualização de cliente
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const client = await Client.findByPk(id);
    if (client) {
      client.name = name || client.name;
      client.email = email || client.email;
      client.phone = phone || client.phone;
      await client.save();
      res.status(200).json(client);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  }
};

// Controller para deletar cliente
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (client) {
      await client.destroy();
      res.status(200).json({ message: 'Cliente deletado com sucesso.' });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente.' });
  }
};
