import axios from "axios";

import { sign } from "jsonwebtoken";

import prismaClient from "../prisma";

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  id: number;
  name: string;
  login: string;
  avatar_url: string;
}

class AuthenticateUserService {
  private async getGitHubToken(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const response = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: "application/json",
      },
    });

    return response.data;
  }

  private async getGitHubUserInfo(gitHubToken: string) {
    const url = "https://api.github.com/user";

    const response = await axios.get<IUserResponse>(url, {
      headers: {
        authorization: `Bearer ${gitHubToken}`,
      },
    });

    return response.data;
  }

  async execute(code: string) {
    const accessTokenResponse = await this.getGitHubToken(code);

    const { id, login, avatar_url, name } = await this.getGitHubUserInfo(
      accessTokenResponse.access_token
    );

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user)
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
        },
      });

    const token = sign(
      {
        user: {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService };
