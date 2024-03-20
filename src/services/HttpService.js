import { AppConstant } from "../constants/AppConstant.js";
import { ArrayHelper } from "../helpers/ArrayHelper.js";
import { ObjectHelper } from "../helpers/ObjectHelper.js";

export class HttpService {

    url = null;
    queryStr = null;
    config = {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: {},
    }

    setSegmentPath(paths) {
        if (ArrayHelper.isArrayValid(paths)) {
            this.url += "/" + paths.join("/");
        }
        return this;
    }

    setFSTokenHeader() {
        this.config.headers['x-api-key'] = AppConstant.FS_TOKEN;
        return this;
    }

    setNoCorsMode() {
        // this.config.mode = "no-cors";
        return this;
    }

    setHeader(key, val) {
        this.config.headers[key] = val;
        return this;
    }

    setBearerToken(token) {
        this.config.headers['Authorization'] = "Bearer " + token;
        return this;
    }

    setContentTypeAsFormData() {
        // delete this.config.headers['Content-Type'];
        // console.log("headers", this.config.headers);
        this.config.headers['Content-Type'] = "multipart/form-data";
        return this;
    }

    constructor(url) {
        this.url = url;
    }

    static getInstance(url) {
        return new HttpService(url);
    }

    setPayload(payload) {
        this.config.method = "POST";
        this.config.body = JSON.stringify(payload);
        return this;
    }

    setFormData(formData) {
        this.config.method = "POST";
        this.config.body = formData;
        return this;
    }

    setQueryStr(queryStr) {
        this.queryStr = queryStr;
        return this;
    }

    buildQueryStr() {
        if (ObjectHelper.isObjectValid(this.queryStr)) {
            this.url += "?";
            for (const key in thia.queryStr) {
                this.url += `${key}=${this.queryStr[key]}&`;
            }
        }
    }

    async call() {
        try {
            this.buildQueryStr();
            let response = await fetch(this.url, this.config);
            return response.json();
        } catch (error) {
            return error;
        }
    }
}