import { Message } from "../domain/message"
import { MessageRepository } from "../infrastructure/MessageRepository"

export class ChatService {
    constructor(private repository: MessageRepository) { }

    async getMessages(): Promise<Message[]> {
        return this.repository.list()
    }

    async addMessage(message: Message): Promise<void> {
        const messages = await this.repository.list()
        await this.repository.save([...messages, message])
    }
}