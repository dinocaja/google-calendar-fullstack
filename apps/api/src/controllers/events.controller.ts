import { Request, Response, NextFunction } from "express";
import * as eventsService from "../services/events.service";
import type { CreateEventBody, GetEventsQuery } from "../schemas/events.schema";

export async function syncEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const result = await eventsService.syncUserEvents(user);
    
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getEvents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { range } = req.validated!.query as GetEventsQuery;
    
    const events = await eventsService.getEventsForRange(user.id, range);
    
    res.json({ data: events });
  } catch (error) {
    next(error);
  }
}

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const input = req.validated!.body as CreateEventBody;
    
    const event = await eventsService.createEvent(user, input);
    
    res.status(201).json({ data: event });
  } catch (error) {
    next(error);
  }
}
