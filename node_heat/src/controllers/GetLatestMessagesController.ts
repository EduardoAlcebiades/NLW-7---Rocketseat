import { Request, Response } from "express";
import { GetLatestMessagesService } from "../services/GetLatestMessagesService";

class GetLatestMessagesController {
  async handle(request: Request, response: Response) {
    const service = new GetLatestMessagesService();

    try {
      const result = await service.execute();

      return response.json(result);
    } catch (err) {
      return response.json({ error: err.message });
    }
  }
}

export default new GetLatestMessagesController();
