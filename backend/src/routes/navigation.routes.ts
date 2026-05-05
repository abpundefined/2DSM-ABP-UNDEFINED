import { Router } from "express";
import {getRootNavigation, getChildren} from "../controllers/navigation.controller";

const router = Router();

router.get("/root", getRootNavigation);

router.get ("/:slug/children", getChildren);

export default router;