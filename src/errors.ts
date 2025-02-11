export class BadCredentialsError extends Error {
  constructor() {
    super('Bad credentials')
  }
}

export class BadRefreshTokenError extends Error {
  constructor() {
    super('Bad refresh token. Please sign in again.')
  }
}

export class ApiUpdatedError extends Error {
  constructor() {
    super(
      'The Api has likely been updated and therefore this library requires updating too.'
    )
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized. Please sign in first.')
  }
}
