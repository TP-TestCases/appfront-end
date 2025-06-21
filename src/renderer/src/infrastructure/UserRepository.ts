import { User } from '../domain/user'

export interface UserRepository {
    list(): Promise<User[]>
    save(users: User[]): Promise<void>
}