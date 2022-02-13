import { Message } from "./Message";

export interface Chat {
    userYouChatWithId: string;
    messages: Message[];
}