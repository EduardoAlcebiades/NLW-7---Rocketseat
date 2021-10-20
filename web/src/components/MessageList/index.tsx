import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../../services/api";

import LogoImg from "../../assets/logo.svg";

import styles from "./styles.module.scss";

type User = {
  name: string;
  login: string;
  avatar_url: string;
};

type Message = {
  id: string;
  text: string;
  user: User;
};

const messageQueue: Message[] = [];

const socket = io(import.meta.env.VITE_APP_URL as string);

socket.on("new_message", (message: Message) => messageQueue.push(message));

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    api
      .get<Message[]>("/messages")
      .then((response) => setMessages(response.data));
  }, [setMessages]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setMessages((prev) =>
          [messageQueue[0], prev[0], prev[1]].filter(Boolean)
        );

        messageQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [setMessages]);

  return (
    <div className={styles.messageListWrapper}>
      <img src={LogoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li key={message.id} className={styles.message}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.login}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
