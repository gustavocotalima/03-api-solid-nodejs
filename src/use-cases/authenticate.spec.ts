import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(user).toHaveProperty('id')
  })
  it('should not be able to authenticate with wrong email', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(UsersRepository)

    await expect(
      async () =>
        await sut.execute({
          email: 'johndoe2@example.com',
          password: '12345678',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(UsersRepository)

    await UsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    })

    await expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '123456789',
        }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
