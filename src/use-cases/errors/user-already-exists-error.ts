export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Users email already exists')
  }
}
