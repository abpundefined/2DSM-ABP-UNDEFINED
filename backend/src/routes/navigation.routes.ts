import { Router } from "express";
import {
  createFeedback,
  createInquiry,
  getChildren,
  getRootNavigation,
} from "../controllers/navigation.controller";

const router = Router();

router.get("/navigation/root", getRootNavigation);

router.get ("/navigation/:slug/children", getChildren);

router.post("/inquiries", createInquiry);

router.post("/feedback", createFeedback);

export default router;
