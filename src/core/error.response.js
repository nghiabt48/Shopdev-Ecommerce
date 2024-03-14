const statusCodeList = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
}
const statusCodeMeaning = {
  FORBIDDEN: 'Bad request error',
  CONFLICT: 'Conflict error',
  BAD: 'Bad request error',
  UNAUTHORIZED: 'Unauthorized error',
  NOT_FOUND: 'Not found Error',

}
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(message = statusCodeMeaning.CONFLICT, statusCode = statusCodeList.CONFLICT) {
    super(message, statusCode)
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message = statusCodeMeaning.BAD, statusCode = statusCodeList.BAD) {
    super(message, statusCode)
  }
}
class AuthFailureRequestError extends ErrorResponse {
  constructor(message = statusCodeMeaning.UNAUTHORIZED, statusCode = statusCodeList.UNAUTHORIZED) {
    super(message, statusCode)
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(message = statusCodeMeaning.FORBIDDEN, statusCode = statusCodeList.FORBIDDEN) {
    super(message, statusCode)
  }
}
class NotFoundError extends ErrorResponse {
  constructor(message = statusCodeMeaning.NOT_FOUND, statusCode = statusCodeList.NOT_FOUND) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError, 
  AuthFailureRequestError,
  NotFoundError,
  ForbiddenError
}