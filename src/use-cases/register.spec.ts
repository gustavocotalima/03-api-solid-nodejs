import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use case', () => {
  it('should be able to register', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    expect(user).toHaveProperty('id')
  })
  it('should hash user password upon registration', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('should not be able to register with an email that is already in use', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '12345678',
    })

    expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
