import { Router } from "express";
import * as ClientController from "../controllers/ClientController";
import * as UserController from "../controllers/userController";
const router = Router();

router.post("/clients", ClientController.createClient);         
router.get("/clients", ClientController.getClients);             
router.get("/clients/:id", ClientController.getClient);    
router.put("/clients/:id", ClientController.updateClient);    
router.delete("/clients/:id", ClientController.deleteClient);

router.post("/login", UserController.login); 
router.post("/registerUser", UserController.registerUser); 
router.put("/updateUser", UserController.updateUser); 

router.get("/users", UserController.getUserData); 

export default router;
