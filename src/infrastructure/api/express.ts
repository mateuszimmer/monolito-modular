import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel as ClientModelAdm } from '../../modules/client-adm/repository/client.model';
import InvoiceItemModel from '../../modules/invoice/repository/invoice-item.model';
import InvoiceModel from '../../modules/invoice/repository/invoice.model';
import TransactionModel from '../../modules/payment/repository/transaction.model';
import { ProductModel as ProductModelAdm } from '../../modules/product-adm/repository/product.model';
import ProductModel from '../../modules/store-catalog/repository/product.model';
import { Umzug } from 'umzug';
import { migrator } from '../db/migrator';
import { productRouter } from './routes/product/product.routes';
import { clientRouter } from './routes/client/client.routes';
import { checkoutRouter } from './routes/checkout/checkout.routes';
import dotenv from 'dotenv';
import ClientModel from '../../modules/checkout/repository/client.model';
import OrderModel from '../../modules/checkout/repository/order.model';
import OrderProductModel from '../../modules/checkout/repository/order-product.model';
import { invoiceRouter } from './routes/invoice/invoice.routes';

export const app: Express = express();
app.use(express.json());
app.use('/products', productRouter);
app.use('/clients', clientRouter);
app.use('/checkouts', checkoutRouter);
app.use('/invoices', invoiceRouter);

export let sequelize: Sequelize;

export let migration: Umzug<any>;

async function setupDb() {
    const isTest = process.env.NODE_ENV === 'test';

    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: isTest ? ':memory:' : './db-data/database-data',
        logging: false
    });
    sequelize.addModels([
        ClientModelAdm,
        ClientModel,
        InvoiceModel, 
        InvoiceItemModel,
        TransactionModel,
        ProductModelAdm,
        ProductModel,
        OrderModel,
        OrderProductModel,
    ]);

    migration = migrator(sequelize);
    isTest ? null : await migration.up();
}

setupDb();