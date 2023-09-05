export class UserAlreadyExistError extends Error {
  constructor() {
    super('Users email already exists')
  }
}
