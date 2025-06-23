import { User } from '../../domain/auth/user'
import { UserRepository } from './UserRepository'

export class InMemoryUserRepository implements UserRepository {
    private users: User[]

    constructor(initialUsers: User[] = []) {
        this.users = initialUsers
    }

    async list(): Promise<User[]> {
        return this.users
    }

    async save(users: User[]): Promise<void> {
        this.users = users
    }
}