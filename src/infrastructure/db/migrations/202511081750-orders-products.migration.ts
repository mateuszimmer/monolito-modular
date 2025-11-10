import { DataTypes, Sequelize } from "sequelize";
import { MigrationFn } from 'umzug';
import ClientModel from "../../../modules/checkout/repository/client.model";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable('order_products', {
        orderId: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        productId: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
    });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable('clients');
};