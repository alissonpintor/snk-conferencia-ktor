import type { HttpClient } from "$lib/sankhya-client/client";


export class MgeWmsSp {
    constructor(
        private server: string,
        private sessionId: string,
        private serviceName: string,
        private httpClient: HttpClient   
    ){}

    getBodyObject = () => {
        
    }
}