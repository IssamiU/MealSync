import { Router } from "express";
import {
  getHistory,
  addToHistory,
  deleteHistoryItem,
  clearHistory,
} from "../controllers/historyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getHistory);
router.post("/", addToHistory);
router.delete("/", clearHistory);   
router.delete("/:id", deleteHistoryItem); 

export default router;