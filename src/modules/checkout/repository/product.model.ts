import { NonAttribute } from "sequelize";
import { BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";
import OrderProductModel from "./order-product.model";

@Table({
    tableName: 'products',
    timestamps: false
})
export default class ProductModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare description: string;

    @Column({ allowNull: false })
    declare salesPrice: number;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;

    @BelongsToMany(() => OrderModel, () => OrderProductModel)
    declare orders?: NonAttribute<OrderModel[]>;

}