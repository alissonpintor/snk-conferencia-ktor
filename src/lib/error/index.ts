import type { Detail } from './http.types';

export * from './http.status';
export * from './http.types';
export { default as BaseException } from './base.exception';
export { BadRequestException } from './400.exception';
export { UnauthorizedException } from './401.exception';
export { ForbiddenException } from './403.exception';
export { NotFoundException } from './404.exception';
export { InternalServerException } from './500.exception';
export { BadGatewayException } from './502.exception';

export type BaseError = {
    code: string | number;
    message: string;
    status: string | number;
    details?: Detail[];
};
