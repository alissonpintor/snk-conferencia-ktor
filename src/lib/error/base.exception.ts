import type { Detail } from "./http.types";

export default class BaseException extends Error {
	
	constructor(
		public readonly code: number,
		public readonly status: string,
		public readonly message: string,
		public readonly details: Detail[] = []
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}