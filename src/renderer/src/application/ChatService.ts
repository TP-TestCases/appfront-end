import { Message } from "@renderer/domain/message"
import { MessageRepository } from "@renderer/infrastructure/MessageRepository"

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