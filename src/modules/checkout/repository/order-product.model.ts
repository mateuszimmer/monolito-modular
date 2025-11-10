import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

@Table({
    tableName: 'order_products',
    timestamps: false,
})
export default class OrderProductModel extends Model {
    
    @PrimaryKey
    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare orderId: string;

    @PrimaryKey
    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare productId: string;
}
