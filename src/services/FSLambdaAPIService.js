import { HttpService } from "./HttpService.js"

export class FSLambdaAPIService {

    httpService = null
    constructor() {
        this.httpService = HttpService.getInstance("https://m71fumfm79.execute-api.us-east-2.amazonaws.com/FreeAgent").setFSTokenHeader();
    }

    setPayload(functionName, data) {
        let payload = { 
            data: { 
                ...data 
            }, 
            "function": functionName 
        };
        this.httpService.setPayload(payload);
        return this;
    }

    static getInstance() {
        return new FSLambdaAPIService();
    }

    call() {
        return this.httpService;
    }

}