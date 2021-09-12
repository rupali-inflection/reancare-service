import { CalorieBalanceDomainModel } from "../../../domain.types/daily.records/CalorieBalance/calorie.balance.domain.model";
import { CalorieBalanceDto } from "../../../domain.types/daily.records/CalorieBalance/calorie.balance.dto";
import { CalorieBalanceSearchFilters, CalorieBalanceSearchResults } from "../../../domain.types/daily.records/CalorieBalance/calorie.balance.search.types";

export interface ICalorieBalanceRepo {

    create(calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto>;

    getById(id: string): Promise<CalorieBalanceDto>;

    search(filters: CalorieBalanceSearchFilters): Promise<CalorieBalanceSearchResults>;

    update(id: string, calorieBalanceDomainModel: CalorieBalanceDomainModel): Promise<CalorieBalanceDto>;

    delete(id: string): Promise<boolean>;

}
