import { HttpCode, HttpStatus } from "./http.status";
import BaseException from "./base.exception";


export class ForbiddenException extends BaseException {
    constructor(message: string) {
        super(
            HttpCode.FORBIDDEN,
            HttpStatus.FORBIDDEN,
            message
        )
    }
}