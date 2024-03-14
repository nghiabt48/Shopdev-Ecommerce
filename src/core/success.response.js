const StatusCode = {
  OK: 200,
  CREATED: 201
}
const StatusCodeMeaning = {
  OK: 'Success',
  CREATED: 'Created'
}

class SuccessResponse {
  constructor(message, statusCode = StatusCode.OK, statusCodeMeaning = StatusCodeMeaning.OK, metadata = {}, options = {}) {
    this.message = !message ? statusCodeMeaning : message
    this.status = statusCode
    this.metadata = metadata
    this.options = options
    this.statusCodeMeaning = statusCodeMeaning
  }
  send(res, header = {}) {
    return res.status( this.status).json(this)
  }
}
class OK extends SuccessResponse {
  constructor({message, metadata}) {
    super( {message, metadata })
  }
}
class CREATED extends SuccessResponse {
  constructor({message, statusCode = StatusCode.CREATED, statusCodeMeaning = StatusCodeMeaning.CREATED, metadata}) {
    super(message, statusCode, statusCodeMeaning, metadata)
  }
}
module.exports = { OK, CREATED, SuccessResponse}