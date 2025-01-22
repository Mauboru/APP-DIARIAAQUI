import { Router } from "express";
import * as ClientController from "../controllers/ClientController";

const router = Router();

router.post("/clients", ClientController.createClient);         
router.get("/clients", ClientController.getClients);             
router.get("/clients/:id", ClientController.getClient);    
router.put("/clients/:id", ClientController.updateClient);    
router.delete("/clients/:id", ClientController.deleteClient);

export default router;