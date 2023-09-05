import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  private usersRepository: UsersRepository
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 8)

    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) throw new Error('User already exists')

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
