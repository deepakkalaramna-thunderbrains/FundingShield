export class AWSService {

    constructor() {
        this.AWS = {
            endpoint: "https://m71fumfm79.execute-api.us-east-2.amazonaws.com/FreeAgent",
            token: "8N7oAta6skipORRc195O7ZccjjzSimJ8qiw998qe",
            functions: {
                getClosingAgentById: "GET_CLOSING_AGENT_ID",
                updateTransactionById: "UPDATE_TRANSACTION_BY_ID",
                getClosingAgentByName: "GET_CLOSING_AGENT_NAME",
                createNewClosingAgent: "CREATE_CLOSING_AGENT",
                getUnderwriterList: "GET_UNDERWRITER_LIST",
                getLenderList: "GET_LENDER_LIST",
                
            }
        }
    }

    initializeRequest(data) {
        let config = {
            method: "POST",
            mode: "cors",
            headers: {
                "x-api-key": this.AWS.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        return fetch(this.AWS.endpoint, config);
    }

    async getClosingAgentById(id) {
        let response = await this.callAWSLambdaApi(this.AWS.functions.getClosingAgentById, { transactionId: id });
        return response;
    }

    async updateTransactionById(data) {
        let response = await this.callAWSLambdaApi(this.AWS.functions.updateTransactionById, data);
        return response;
    }

    async getClosingAgentByName(data) {
        try {
            let body = {
                function: this.AWS.functions.getClosingAgentByName,
                data: data
            };
            let response = await this.initializeRequest(body);
            response = await response.json();
            return response;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getUnderwriterList(name) {
        let response = await this.callAWSLambdaApi(this.AWS.functions.getUnderwriterList, { name });
        return response;
    }

    async getLenderList(data) {
        let response = await this.callAWSLambdaApi(this.AWS.functions.getLenderList, data);
        return response;
    }

    async createClosingAgent(data) {
        try {
            let body = {
                function: this.AWS.functions.createNewClosingAgent,
                data: data
            }
            let response = await this.initializeRequest(body);
            response = await response.json();
            return response;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async callAWSLambdaApi(functionType, data) {
        try {
            let body = {
                function: functionType,
                data
            }
            let response = await this.initializeRequest(body);
            response = await response.json();
            return response;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}