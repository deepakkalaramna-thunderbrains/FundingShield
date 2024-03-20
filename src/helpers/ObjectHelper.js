

export class ObjectHelper {

    static isObjectValid(objData) {
        return objData && Object.keys(objData).length > 0;
    }
}