export default class CustomError extends Error {
  override name = "CustomError";
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
