import { Router } from "express";
import authRoutes from "./auth.routes.js";
import orgRoutes from "./org.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import leaveRoutes from "./leave.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/org", orgRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leave", leaveRoutes);

export default router;