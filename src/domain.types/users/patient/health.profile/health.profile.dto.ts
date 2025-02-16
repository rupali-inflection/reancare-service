export interface HealthProfileDto {
    id                     : string;
    PatientUserId?         : string;
    BloodGroup?            : string;
    BloodTransfusionDate?  : Date;
    BloodDonationCycle?    : number;
    MajorAilment?          : string;
    OtherConditions?       : string;
    IsDiabetic?            : boolean;
    HasHeartAilment?       : boolean;
    MaritalStatus?         : string;
    Ethnicity?             : string;
    Race?                  : string;
    Nationality?           : string;
    Occupation?            : string;
    SedentaryLifestyle?    : boolean;
    IsSmoker?              : boolean;
    SmokingSeverity?       : string;
    SmokingSince?          : Date;
    IsDrinker?             : boolean;
    DrinkingSeverity?      : string;
    DrinkingSince?         : Date;
    SubstanceAbuse?        : boolean;
    ProcedureHistory?      : string;
    ObstetricHistory?      : string;
    OtherInformation?      : string;
    TobaccoQuestion?       : string;
    TobaccoQuestionAns?    : boolean;
    TypeOfStroke?          : string;
    HasHighBloodPressure?  : boolean;
    HasHighCholesterol?    : boolean;
    HasAtrialFibrillation? : boolean;
}
