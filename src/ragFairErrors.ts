export class RagfairError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnknownRagfairError";
  }
}

export class InvalidUserIdError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidUserIdError";
  }
}

export class BadLoginError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "BadLoginError";
  }
}

export class InvalidParametersError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidParametersError";
  }
}

export class InvalidBarterItemsError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidBarterItemsError";
  }
}

export class InMaintenanceError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "InMaintenanceError";
  }
}

export class BackendError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "BackendError";
  }
}

export class MaxOfferCountError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "MaxOfferCountError";
  }
}

export class InsufficientTaxFundsError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "InsufficientTaxFundsError";
  }
}

export class OfferNotFoundError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "OfferNotFoundError";
  }
}

export class BadLoyaltyLevelError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "BadLoyaltyLevelError";
  }
}

export class OfferNotAvailableYetError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "OfferNotAvailableYetError";
  }
}

export class TransactionError extends RagfairError {
  constructor(message?: string) {
    super(message);
    this.name = "TransactionError";
  }
}