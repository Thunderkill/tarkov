export class ApiError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotAuthorizedError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "NotAuthorizedError";
  }
}

export class BadAccountIdError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "BadAccountIdError";
  }
}

export class WrongCredentialsError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "WrongCredentialsError";
  }
}

export class NewHardwareError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "NewHardwareError";
  }
}

export class WrongActivationCodeError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "WrongActivationCodeError";
  }
}

export class EnterCaptchaError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "EnterCaptchaError";
  }
}

export class MissingParametersError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "MissingParametersError";
  }
}

export class TwoFactorRequiredError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "TwoFactorRequiredError";
  }
}

export class BadTwoFactorCodeError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "BadTwoFactorCodeError";
  }
}

export class CaptchaRequiredError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.name = "CaptchaRequiredError";
  }
}
