import { HttpCode, HttpStatus } from "./http.status";
import BaseException from "./base.exception";


export class BadRequestException extends BaseException {
    constructor(message: string) {
        super(
            HttpCode.BAD_REQUEST,
            HttpStatus.BAD_REQUEST,
            message
        )
    }
}