import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

export type ProductConstructorProps = {
    id?: Id;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Product extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _description: string;
    private _purchasePrice: number;
    private _stock: number;

    constructor(input: ProductConstructorProps) {
        super(input.id, input.createdAt, input.createdAt);
        this._name = input.name;
        this._description = input.description;
        this._purchasePrice = input.purchasePrice;
        this._stock = input.stock;
    }

    get name(): string {
        return this._name;
    }

    set name(aName: string) {
        this._name = aName;
    }

    get description(): string {
        return this._description;
    }

    set description(aDescription: string) {
        this._description = aDescription;
    }

    get purchasePrice(): number {
        return this._purchasePrice;
    }

    set purchasePrice(aPurchasePrice: number) {
        this._purchasePrice = aPurchasePrice;
    }

    get stock(): number {
        return this._stock;
    }

    set stock(aStock: number) {
        this._stock = aStock;
    }

}