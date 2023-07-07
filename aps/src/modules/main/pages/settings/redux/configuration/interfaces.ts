export interface Configuration {
    quantities1: UnitOfMeasure[];
    quantities2: UnitOfMeasure[];
}

export interface UnitOfMeasure {
    unitOfMeasureId: number;
    isKg: boolean;

}