import { healthcare_v1 } from 'googleapis';
import { Logger } from '../../../../../../common/logger';
import { ICarePlanStore } from '../../../../interfaces/careplan.store.interface';
import { GcpHelper } from './helper.gcp';
import { CarePlanEnrollmentDomainModel } from '../../../../../../domain.types/clinical/careplan/enrollment/careplan.enrollment.domain.model';

////////////////////////////////////////////////////////////////////////////////

export class GcpCarePlanStore implements ICarePlanStore {

    search(filter): Promise<any> {
        throw new Error(`Method not implemented ${filter}.`);
    }

    add = async (model: CarePlanEnrollmentDomainModel): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            var body = this.createCarePlanFhirResource(model);
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}`;
            const request = { parent, type: 'CarePlan', requestBody: body };
            const resource = await g.projects.locations.datasets.fhirStores.fhir.create(
                request
            );
            var data: any = resource.data;

            return data.id;
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    getById = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'CarePlan';
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            const resource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data: any = resource.data;
            return data;
            
        } catch (error) {
            if (error.message != null) {
                // eslint-disable-next-line no-prototype-builtins
                if (error.message.hasOwnProperty('issue')) {
                    var issue = error.message.issue[0];
                    Logger.instance().log(issue.diagnostics);
                    return null;
                }
            }
            Logger.instance().log(error.message);
        }
    };

    update = async (resourceId:string, updates: CarePlanEnrollmentDomainModel): Promise<any> => {

        try {

            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'CarePlan';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            var existingResource = await g.projects.locations.datasets.fhirStores.fhir.read(
                { name: parent }
            );
            var data:any = existingResource.data;
            //delete data.id; //Remove id from the resource
        
            //Construct updated body
            const body: healthcare_v1.Schema$HttpBody = this.updateCarePlanFhirResource(updates, data);
            const updatedResource = await g.projects.locations.datasets.fhirStores.fhir.update({
                name        : parent,
                requestBody : body,
            });
            var data: any = updatedResource.data;
            Logger.instance().log(`Updated ${resourceType} resource:\n${updatedResource.data}`);
            return data;

        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
        }
    };

    delete = async (resourceId: string): Promise<any> => {
        try {
            var g = await GcpHelper.getGcpClient();
            const c = GcpHelper.getGcpFhirConfig();
            const resourceType = 'CarePlan';

            //Get the existing resource
            const parent = `projects/${c.ProjectId}/locations/${c.CloudRegion}/datasets/${c.DatasetId}/fhirStores/${c.FhirStoreId}/fhir/${resourceType}/${resourceId}`;
            await g.projects.locations.datasets.fhirStores.fhir.delete(
                { name: parent }
            );
        } catch (error) {
            Logger.instance().log(error.message);
            throw error;
            
        }
    };

    //#region Private methods

    private createCarePlanFhirResource(model: CarePlanEnrollmentDomainModel): any {

        var resource = {
            resourceType : "CarePlan",
            status       : "unknown",
            intent       : "plan"
            
        };

        if (model.PlanName != null) {
            resource['title'] = model.PlanName;
        }

        if (model.Provider != null) {
            resource['author'] = {
                display : model.Provider
            };
        }

        if (model.PatientUserId != null) {
            resource['subject'] = {
                id      : `${model.PatientUserId}`,
                display : model.Name
            };
        }

        if (model.StartDate != null) {
            resource['period'] = {
                start : model.StartDate,
                end   : model.EndDate
            };
        }

        return resource;
    }
    
    private updateCarePlanFhirResource(updates: CarePlanEnrollmentDomainModel, existingResource: any): any {

        existingResource.resourceType = "CarePlan";

        if (updates.PlanName != null) {
            existingResource['title'] = updates.PlanName;
        }

        if (updates.Provider != null) {
            existingResource['author'] = {
                display : updates.Provider
            };
        }

        if (updates.PatientUserId != null) {
            existingResource['subject'] = {
                id      : `${updates.PatientUserId}`,
                display : updates.Name
            };
        }

        if (updates.StartDate != null) {
            existingResource['period'] = {
                start : updates.StartDate,
                end   : updates.EndDate
            };
        }
        
        return existingResource;
    }
        
}
