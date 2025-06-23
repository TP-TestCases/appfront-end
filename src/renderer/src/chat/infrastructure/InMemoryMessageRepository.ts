import { Message } from '../domain/message'
import { MessageRepository } from './MessageRepository'

export class InMemoryMessageRepository implements MessageRepository {
    private messages: Message[]

    constructor(initialMessages: Message[] = []) {
        this.messages = initialMessages
    }

    async list(): Promise<Message[]> {
        return this.messages
    }

    async save(messages: Message[]): Promise<void> {
        this.messages = messages
    }
}