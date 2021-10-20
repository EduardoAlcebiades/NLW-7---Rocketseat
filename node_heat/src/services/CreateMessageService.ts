import prismaClient from "../prisma";

import { io } from "../server";

class CreateMessageService {
  async execute(text: string, user_id: string) {
    const message = await prismaClient.message.create({
      data: {
        text,
        user_id,
      },
      include: {
        user: true,
      },
    });

    const infoWS = message;

    delete infoWS.user.github_id;

    io.emit("new_message", infoWS);

    return message;
  }
}

export { CreateMessageService };
