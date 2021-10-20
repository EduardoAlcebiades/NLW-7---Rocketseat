import { Router } from "express";

import AuthenticateUserController from "./controllers/AuthenticateUserController";
import CreateMessageController from "./controllers/CreateMessageController";
import GetLatestMessagesController from "./controllers/GetLatestMessagesController";
import ProfileUserController from "./controllers/ProfileUserController";

import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const routes = Router();

// ---------- Authenticated Routes ----------

routes.get("/my_profile", ensureAuthenticated, ProfileUserController.handle);
routes.post("/messages", ensureAuthenticated, CreateMessageController.handle);

// ---------- Routes without authentication ----------

routes.post("/authenticate", AuthenticateUserController.handle);
routes.get("/messages", GetLatestMessagesController.handle);

export { routes };
