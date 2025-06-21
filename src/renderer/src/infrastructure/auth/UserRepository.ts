import { User } from '../../domain/auth/user'

export interface UserRepository {
    list(): Promise<User[]>
    save(users: User[]): Promise<void>
}