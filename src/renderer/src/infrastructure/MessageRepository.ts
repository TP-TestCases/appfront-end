import { Message } from '../domain/message'

export interface MessageRepository {
    list(): Promise<Message[]>
    save(messages: Message[]): Promise<void>
}