import { appletClientServiceIns } from "./AppletClientService.js";

export class FreeAgentApiService {

    entityName = null;
    freeagentId = null;
    constructor(entityName, faId) {
        this.entityName = entityName;
        this.freeagentId = faId;
    }

    static getFreeAgentApiServiceIns(entityName, faId) {
        return new FreeAgentApiService(entityName, faId);
    }

    listEntityValuesFree(config, callback) {
        appletClientServiceIns.getFFAAppletClientIns().listEntityValues(config, callback);
    }

    updateEntityFree(config, callback) {
        appletClientServiceIns.getFFAAppletClientIns().updateEntity(config, callback);
    }

    listEntityValues(fields, callback) {
        let entityData = {
            entity: this.entityName,
            fields: fields,
            id: this.freeagentId
        };
        appletClientServiceIns.getFFAAppletClientIns().listEntityValues(entityData, callback);
    }

    listEntityValuesWithFilters(field, fields, callback, operator) {
        operator = operator || "includes";
        let entityData = {
            entity: this.entityName,
            filters: [
                {
                    field_name: field,
                    operator,
                    values: [this.freeagentId]
                }
            ],
            fields: fields,
            limit: 1
        };
        console.log("entityData", entityData);
        appletClientServiceIns.getFFAAppletClientIns().listEntityValues(entityData, callback);
    }

    updateEntity(fieldValuesData, callback) {
        let updateEntityObj = {
            id: this.freeagentId,
            entity: this.entityName,
            field_values: fieldValuesData
        };
        appletClientServiceIns.getFFAAppletClientIns().updateEntity(updateEntityObj, (data) => {
            appletClientServiceIns.showSnackBar("Updated Successfully");
            callback(data);
        });
    }

    delete() {

    }

}