import { Router } from "express";
import * as eventsController from "../controllers/events.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { syncRateLimiter } from "../middlewares/rateLimiter.middleware";
import { createEventSchema, getEventsSchema } from "../schemas/events.schema";

const router = Router();

router.use(authMiddleware);

router.post("/sync", syncRateLimiter, eventsController.syncEvents);
router.get("/", validate(getEventsSchema), eventsController.getEvents);
router.post("/", validate(createEventSchema), eventsController.createEvent);

export default router;
