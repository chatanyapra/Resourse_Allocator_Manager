import express from "express";
import {
    allocateResource,
    deletePod,
    listAllPodsWithNodes,
    getPodById,
    getUserPods,
    getAllPods,
    getPodStats,
    getPodsGroupedByNode as getPodsGroupedByNodeHandler
} from "../controllers/pod.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// ─── Public routes (no auth required) ───
router.get("/list", listAllPodsWithNodes);       // K8s-based pod listing
router.get("/stats", getPodStats);               // Pod statistics

// ─── Protected routes (JWT required) ───
router.get("/", authenticate, getAllPods);                    // Get all pods from database
router.get("/user", authenticate, getUserPods);              // Get current user's pods
router.get("/grouped", authenticate, getPodsGroupedByNode); // Get pods grouped by node (new feature)
router.get("/:appName", authenticate, getPodById);           // Get specific pod by app name
router.post("/allocate", authenticate, allocateResource);    // Create new pod allocation
router.delete("/:appName", authenticate, deletePod);         // Delete pod allocation

export default router;