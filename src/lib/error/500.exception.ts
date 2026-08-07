import { HttpCode, HttpStatus } from "./http.status";
import BaseException from "./base.exception";


export class InternalServerException extends BaseException {
    constructor(message: string) {
        super(
            HttpCode.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
            message
        )
    }
}
