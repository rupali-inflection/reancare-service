import { ICareplanService } from "./interfaces/careplan.service.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { EnrollmentDomainModel } from "./domain.types/enrollment/enrollment.domain.model";
import Dictionary from "../../common/dictionary";
import { CareplanActivity } from "./domain.types/activity/careplan.activity";
import { ParticipantDomainModel } from "./domain.types/participant/participant.domain.model";
import { ProviderResolver } from "./provider.resolver";
import { ConfigurationManager } from "../../config/configuration.manager";
import { CareplanConfig } from "../../config/configuration.types";
import { CareplanActivityDetails } from "./domain.types/activity/careplan.activity.details.dto";

////////////////////////////////////////////////////////////////////////

export class CareplanHandler {

    static _services:Dictionary<ICareplanService> = new Dictionary<ICareplanService>()

    public static init = async (): Promise<boolean> => {

        CareplanHandler._services = ProviderResolver.resolve();

        for await (var s of CareplanHandler._services.getKeys()) {
            var service = CareplanHandler._services.getItem(s);
            await service.init();
        }
        return true;
    };

    public isPlanAvailable(provider: string, planCode: string): boolean {
        var careplans = ConfigurationManager.careplans();
        var foundProvider = careplans.find(x => {
            return x.Provider === provider;
        });
        if (foundProvider) {
            var providerPlans = foundProvider.Plans;
            const foundPlan = providerPlans.find(y => {
                return y.ProviderCode === planCode;
            });
            if (foundPlan) {
                return true;
            }
        }
        return false;
    }

    public getPlanDetails(provider: string, planCode: string): CareplanConfig {
        var careplans = ConfigurationManager.careplans();
        var foundProvider = careplans.find(x => {
            return x.Provider === provider;
        });
        if (foundProvider) {
            var providerPlans = foundProvider.Plans;
            const foundPlan = providerPlans.find(y => {
                return y.ProviderCode === planCode;
            });
            if (foundPlan) {
                return foundPlan;
            }
        }
        return null;
    }

    public registerPatientWithProvider = async(patientDetails: ParticipantDomainModel, provider: string) => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.registerPatient(patientDetails);
    }

    public enrollPatientToCarePlan = async (
        enrollmentDetails: EnrollmentDomainModel
    ): Promise<string> => {
        const provider = enrollmentDetails.Provider;
        var service = CareplanHandler._services.getItem(provider);
        return await service.enrollPatientToCarePlan(enrollmentDetails);
    };

    public fetchActivities = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        fromDate: Date,
        toDate: Date
    ): Promise<CareplanActivity[]> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.fetchActivities(careplanCode, enrollmentId, fromDate, toDate);
    };

    public getActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        activityId: string,
        scheduledAt: Date,
        sequence: number
    ): Promise<CareplanActivityDetails> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.getActivity(patientUserId, careplanCode, enrollmentId, activityId, scheduledAt, sequence);
    };

    public updateActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        activityId: string,
        updates: any
    ): Promise<CareplanActivity> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateActivity(patientUserId, careplanCode, enrollmentId, activityId, updates);
    };

    public updateAssessmentActivity = async (
        patientUserId: uuid,
        provider: string,
        careplanCode: string,
        enrollmentId: string,
        activityId: string,
        scheduledAt: Date,
        sequence: number,
        updates: any
    ): Promise<CareplanActivity> => {
        var service = CareplanHandler._services.getItem(provider);
        return await service.updateAssessmentActivity(patientUserId, careplanCode, enrollmentId,
            activityId, scheduledAt, sequence, updates);
    };
}
