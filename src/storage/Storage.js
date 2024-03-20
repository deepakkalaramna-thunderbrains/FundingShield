
export class Storage {

    static instanceId = "";

    static setInstanceId(id){
        this.instanceId = id;
    }
    static getInstanceId(){
        return this.instanceId;
    }
}