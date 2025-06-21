import { Message } from "@renderer/domain/chat/message"

export interface MessageRepository {
    list(): Promise<Message[]>
    save(messages: Message[]): Promise<void>
}