import { HttpCode, HttpStatus } from "./http.status";
import BaseException from "./base.exception";


export class NotFoundException extends BaseException {
    constructor(message: string) {
        super(
            HttpCode.NOT_FOUND,
            HttpStatus.NOT_FOUND,
            message
        )
    }
}