import { HttpCode, HttpStatus } from "./http.status";
import BaseException from "./base.exception";


export class UnauthorizedException extends BaseException {
    constructor(message: string) {
        super(
            HttpCode.UNAUTHORIZED,
            HttpStatus.UNAUTHORIZED,
            message
        )
    }
}