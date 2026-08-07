import { View } from "./views/views"; // Assuming View is a generic type


export class BaseError extends Error {
	constructor(
		public readonly status: number,
		public readonly message: string,
		public readonly code: string,
		public readonly details: any[] = []
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

class HttpClientError extends BaseError {
	constructor(
		message: string,
	) {
		super(500, message, "HTTP_CLIENT_ERROR")
	}
}

class LoadViewError extends BaseError {
	constructor(
		message: string,
	) {
		super(500, message, "LOAD_VIEW_ERROR")
	}
}


export interface HttpClient {
	post(serverUrl: string,
		body: string,
		sessionId: string,
		serviceName: string,
		isWms?: boolean
	): Promise<Response>
}


class SankhyaHttpClient implements HttpClient {
	async post(
		serverUrl: string,
		body: string,
		sessionId: string,
		serviceName: string,
		isWms: boolean = false,
	) {
		const url = this.getUrl(serverUrl, sessionId, serviceName, isWms);		
		const headers = this.getHeaders(sessionId);

		try {
			const response = await fetch(url, {
				method: "POST",
				headers,
				body,
			});
			return response;
		} catch (error) {
			let errorMessage = "Erro descohecido";
			if (error instanceof Error ) errorMessage = error.message;
			throw new HttpClientError(errorMessage);
		}
	}

	private getUrl(
		serverUrl: string,
		sessionId: string,
		serviceName: string,
		isWms: boolean = false,
	) {
		const path = isWms ? "mgewms" : "mge";
		const params = new URLSearchParams();		
		params.append("serviceName", serviceName);
		params.append("mgeSession", sessionId);
		params.append("outputType", "json");
		const url = `${serverUrl}/${path}/service.sbr?${params.toString()}`;
		return url;
	}

	private getHeaders(sessionId: string) {
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Cookie", `JSESSIONID=${sessionId}`);
		return headers;
	}		
}


export class LoadView {
	private serviceName = 'CRUDServiceProvider.loadView';

	constructor(
		private server: string,
		private sessionId: string,
		private httpClient: HttpClient = new SankhyaHttpClient()
	) {}

	async get<TData>(view: View<TData>) {
		try {
			const response: Response = await this.httpClient.post(
				this.server,
				JSON.stringify(view.getBodyObject()),
				this.sessionId,
				this.serviceName
			)
			
			const jsonData = await this.getJsonData(response);
			if (Number(jsonData.status) !== 1) {
				throw new LoadViewError(jsonData.statusMessage)
			}

			return jsonData;
		}			
		catch(error) {
			if (error instanceof HttpClientError) throw error;
			const errorMessage = (error instanceof Error) ? error.message : "Erro Desconhecido";
			throw new LoadViewError(errorMessage);
		}
	}

	private async getJsonData(response: Response) {
		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder('windows-1252');
		const jsonDecoded = decoder.decode(buffer);
		const jsonData = JSON.parse(jsonDecoded);
		return jsonData;
	}
}


export class WmsMgeClient {
	constructor(
		private server: string,
		private sessionId: string,
		private httpClient: HttpClient = new SankhyaHttpClient()
	) {}

	async get<TData>(view: View<TData>) {
		try {
			const response: Response = await this.httpClient.post(
				this.server,
				JSON.stringify(view.getBodyObject()),
				this.sessionId,
				this.serviceName
			)
			
			const jsonData = await this.getJsonData(response);
			if (Number(jsonData.status) !== 1) {
				throw new LoadViewError(jsonData.statusMessage)
			}

			return jsonData;
		}			
		catch(error) {
			if (error instanceof HttpClientError) throw error;
			let errorMessage = (error instanceof Error) ? error.message : "Erro Desconhecido";
			throw new LoadViewError(errorMessage);
		}
	}

	private async getJsonData(response: Response) {
		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder('windows-1252');
		const jsonDecoded = decoder.decode(buffer);
		const jsonData = JSON.parse(jsonDecoded);
		return jsonData;
	}
}


export const sankhyaApiClient = new SankhyaHttpClient();

