

export class DocumentTypeHelper {


    constructor() {

    }

    static STATUS_MAPPING = {
        first : {
            validated : ["5bf00f35-12c1-48aa-94b7-0d1904a1ef4e"],
            rejected : [
                "ca037a49-6021-4045-9c31-4c11038ae922",
                "1d44651d-64a0-4fa0-a7da-8388fd503f5f"
            ],
            progress : [
                "e720a0d9-3712-4bcb-80b5-cfd20b604ff5",
                "bb898b9e-056e-4771-8fc7-584abb61295b"
            ],
            requested : [
                "e720a0d9-3712-4bcb-80b5-cfd20b604ff5"
            ],
            received : [
                "bb898b9e-056e-4771-8fc7-584abb61295b"
            ]
        },
        second : {
            validated : ["5500b990-c645-4280-8bc8-1c9d4852616d"],
            rejected : [
                "9d551fbd-14cb-46ba-a6e3-e4bc090fc4d7",
                "fc97b586-3c73-4913-88c7-1a2f4498c93a",
                "3da08a2f-1142-46d2-b80d-ee2f895a6f90"
            ],
            progress : [
                "f2903007-eab5-4d03-94b4-f071d4fd3210",
                "56e58bdd-9a50-4f5a-9c1f-769760e6113b"
            ],
            requested : [
                "f2903007-eab5-4d03-94b4-f071d4fd3210"
            ],
            received : [
                "56e58bdd-9a50-4f5a-9c1f-769760e6113b"
            ]
        },
        status : {
            first : {
                completed : "5bf00f35-12c1-48aa-94b7-0d1904a1ef4e",
                rejected : "ca037a49-6021-4045-9c31-4c11038ae922",
                requested : "e720a0d9-3712-4bcb-80b5-cfd20b604ff5",
                received : "bb898b9e-056e-4771-8fc7-584abb61295b"
            },
            second : {
                completed : "5500b990-c645-4280-8bc8-1c9d4852616d",
                rejected : "fc97b586-3c73-4913-88c7-1a2f4498c93a",
                requested : "f2903007-eab5-4d03-94b4-f071d4fd3210",
                received : "56e58bdd-9a50-4f5a-9c1f-769760e6113b"
            },
            default : "157032ff-c21a-4958-a422-fcabec1f7edd"
        }
    }

    static getStatusState = (statusMapping, statusList) => {

        return statusList.reduce ((result,val) => {
            if(statusMapping.validated.includes(val)){
                result.validated++;
            }

            if(statusMapping.rejected.includes(val)){
                result.rejected++;
            }

            if(statusMapping.progress.includes(val)){
                result.progress++;
            }

            if(statusMapping.received.includes(val)){
                result.received++;
            }

            if(statusMapping.requested.includes(val)){
                result.requested++;
            }

            return result;
        },{validated : 0, rejected : 0, progress : 0, invalid : 0, requested : 0, received : 0});
    }

    static getOrderReviewStatus = (status, statusMapping, statusListLength) => {

        if(!status.validated && !status.rejected && !status.progress){
            return null;
        }

        if(status.rejected > 0){
            return statusMapping.rejected;
        }

        if(status.validated == statusListLength){
            return statusMapping.completed;
        }

        if(status.progress > 0 || status.validated > 0){
            
            if(status.requested > 0){
                return statusMapping.requested;
            }

            return statusMapping.received;
        }

        return this.STATUS_MAPPING.status.default;
    }

    static getAppropiateStatus(statusArray) {
        if(statusArray.length == 0){
            return this.STATUS_MAPPING.status.default;
        }

        let secondValidation = this.getStatusState(this.STATUS_MAPPING.second, statusArray);
        let firstValidation = this.getStatusState(this.STATUS_MAPPING.first, statusArray);

        let status = this.getOrderReviewStatus(secondValidation, this.STATUS_MAPPING.status.second, statusArray.length)

        if(status){
            return status;
        }

        return this.getOrderReviewStatus(firstValidation, this.STATUS_MAPPING.status.first, statusArray.length) || this.STATUS_MAPPING.status.default;
    }

    static getFADocumentFileTypeSystemName(documentFileType) {
        let data = { 
            pdfClosingProtectionLetter: "order_val_field163", 
            pdfWireInstructions: "order_val_field170", 
            pdfErrorsAndOmissionsInsurance: "order_val_field161", 
            pdfCrimesPolicy: "order_val_field165", 
            pdfFidelityBond: "order_val_field162", 
            pdfStateLicense: "order_val_field169", 
            pdfBankReferenceLetter: "order_val_field166", 
            pdfLenderTitleCommitment: "order_val_field168", 
            pdfCPLValidation : "order_val_field176",
            pdfGuardianCertification: "" 
        };
        return data[documentFileType] || null;
    }

    static getFADocumentStatus(fsCurrentReviewStatusId) {
        let data = { 
            "9d2d40cf-298a-4240-a16a-d22b8240c39e": "e720a0d9-3712-4bcb-80b5-cfd20b604ff5", 
            "55c1e163-ae87-4e8c-9585-bdb33462b451": "bb898b9e-056e-4771-8fc7-584abb61295b", 
            "47d45485-e9aa-45b5-b6c7-dc8612bdb9b9": "1d44651d-64a0-4fa0-a7da-8388fd503f5f", 
            "6fe43019-e538-437f-9af1-ac90460d0a68": "5bf00f35-12c1-48aa-94b7-0d1904a1ef4e", 
            "954da06c-6d04-471d-bd34-59100ef12044": "f2903007-eab5-4d03-94b4-f071d4fd3210", 
            "09fb276d-ccea-4d08-905c-3a6d17a756af": "56e58bdd-9a50-4f5a-9c1f-769760e6113b", 
            "9d551fbd-14cb-46ba-a6e3-e4bc090fc4d7": "3da08a2f-1142-46d2-b80d-ee2f895a6f90", 
            "e0de6b95-58ce-4cb8-9bdf-051c136e67dc": "5500b990-c645-4280-8bc8-1c9d4852616d" 
        };
        return data[fsCurrentReviewStatusId] || null;
    }
}