import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRespository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRespository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRespository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Gym 01',
      description: 'Gym 01 description',
      phone: '31999999999',
      latitude: new Decimal(-19.6416368),
      longitude: new Decimal(-43.2318939),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -19.6416368,
      userLongitude: -43.2318939,
    })

    expect(checkIn).toHaveProperty('id')
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -19.6416368,
      userLongitude: -43.2318939,
    })

    await expect(
      async () =>
        await sut.execute({
          userId: 'user-01',
          gymId: 'gym-01',
          userLatitude: -19.6416368,
          userLongitude: -43.2318939,
        }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in on different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -19.6416368,
      userLongitude: -43.2318939,
    })
    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -19.6416368,
      userLongitude: -43.2318939,
    })

    expect(checkIn).toHaveProperty('id')
  })

  it('should not be able to check in if user is distant to the gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -19.6416368,
        userLongitude: -43.2318939,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
