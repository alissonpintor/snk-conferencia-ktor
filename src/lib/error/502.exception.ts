import { HttpCode, HttpStatus } from "./http.status";
import BaseException from "./base.exception";


export class BadGatewayException extends BaseException {
    constructor(message: string) {
        super(
            HttpCode.BAD_GATEWAY,
            HttpStatus.BAD_GATEWAY,
            message
        )
    }
}
