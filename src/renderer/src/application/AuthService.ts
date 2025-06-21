import { User } from '@renderer/domain/user'
import { UserRepository } from '@renderer/infrastructure/UserRepository'

export class AuthService {
    constructor(private repository: UserRepository) { }

    async login(username: string, password: string): Promise<User | null> {
        const users = await this.repository.list()
        const found = users.find(
            (u) => u.username === username && u.password === password
        )
        return found ?? null
    }

    async register(user: User): Promise<void> {
        const users = await this.repository.list()
        await this.repository.save([...users, user])
    }
}