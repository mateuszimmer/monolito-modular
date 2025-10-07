import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import { NonAttribute } from "sequelize";



@Table({
    tableName: 'invoiceItem',
    timestamps: false
})
export default class InvoiceItemModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false, field: 'invoice_id' })
    declare invoiceId: string;

    @BelongsTo(() => InvoiceModel, 'invoiceId')
    declare invoice: NonAttribute<InvoiceModel>;

}