export default class ExpressError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super();
    this.name = 'ExpressError';
    this.status = status;
    this.message = message;
  }
}
