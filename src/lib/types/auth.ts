export interface AuthCredentials {
    username: string;
    password?: string;
    server: string;
}

export interface UserSession {
    jsessionid: string;
    idusu: string;
    nomeusu: string;
    server: string;
}

export interface AuthError {
    message: string;
    code?: string;
}

export interface IAuthService {
    login(credentials: AuthCredentials): Promise<UserSession>;
}
