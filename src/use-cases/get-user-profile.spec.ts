import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('12345678', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to get user profile with wrong id', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfileUseCase(UsersRepository)

    await expect(
      async () =>
        await sut.execute({
          userId: 'this is a wrong id',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
