import { SettingsPageItem } from "../../consts/interfaces";

export interface Configuration {
    quantities1: UnitOfMeasure[];
    quantities2: UnitOfMeasure[];
}

export interface UnitOfMeasure {
    unitOfMeasureId: number;
    isKg: boolean;
    unitOfMeasure: SettingsPageItem;

}