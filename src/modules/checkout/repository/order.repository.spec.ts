import { Sequelize } from "sequelize-typescript";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import OrderProductModel from "./order-product.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import { ClientModel as ClientModelAdm } from "../../client-adm/repository/client.model";
import ClientModel from "./client.model";
import { Umzug } from "umzug";
import { migrator } from "../../../infrastructure/db/migrator";
import { ProductModel as ProductModelAdm } from "../../product-adm/repository/product.model";
import ProductModel from "./product.model";

describe('Order Repository tests', () => {

    let sequelize: Sequelize;
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            logging: false,
            storage: ':memory:'
        });

        sequelize.addModels([
            ClientModelAdm,
            ClientModel,
            OrderModel,
            ProductModelAdm,
            ProductModel,
            OrderProductModel
        ]);

        migration = migrator(sequelize);
        await migration.up();
    });

    afterEach(async () => {
        if (!migration || !sequelize)
            return;

        migration = migrator(sequelize);
        await migration.down();
        await sequelize.close();
    });

    it('should place an order', async () => {
        const repo = new OrderRepository();

        const client = new Client({
            name: 'Jonh Wick',
            email: 'john@wick.com',
            street: 'Main St.',
            number: '123',
            complement: '022',
            city: 'New York',
            state: 'NY',
            zipCode: '123456',
        });

        await ClientModelAdm.create({
            id: client.id.id,
            name: client.name,
            document: '123456444',
            email: client.email,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            updatedAt: client.updatedAt,
            createdAt: client.createdAt,
        })

        const products = [
            new Product({
                name: 'Product 1',
                description: 'Product 1 description',
                salesPrice: 157,
            }),
            new Product({
                name: 'Product 2',
                description: 'Product 2 description',
                salesPrice: 97,
            }),
        ];

        for (const p of products) {
            try {
                await ProductModelAdm.create({
                    id: p.id.id,
                    name: p.name,
                    description: p.description,
                    salesPrice: p.salesPrice,
                    purchasePrice: 15,
                    stock: 10,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                });
            } catch(e) {
                console.log('ERRO =========================================================================')
                console.log(e)
            }
        };

        const order = new Order({
            client,
            products
        });

        order.approve();
        try {
            await repo.addOrder(order);
        } catch (e) {
            console.log(e)
        }

        const orderModel = await OrderModel.findOne({
            where: { id: order.id.id },
            include: [ ProductModel ]
        })

        expect(orderModel.id).toBe(order.id.id);
        expect(orderModel.clientId).toBe(order.client.id.id);
        expect(orderModel.status).toBe(order.status);
        expect(orderModel.products[0].id).toBe(order.products[0].id.id);
        expect(orderModel.products[1].id).toBe(order.products[1].id.id);
        expect(orderModel.createdAt).toEqual(order.createdAt);
        expect(orderModel.updatedAt).toEqual(order.updatedAt);
    });

    it('should find a order byId', async () => {

        const repo = new OrderRepository();

        const client = new Client({
            name: 'Jonh Wick',
            email: 'john@wick.com',
            street: 'Main St.',
            number: '123',
            complement: '022',
            city: 'New York',
            state: 'NY',
            zipCode: '123456',
        });

        await ClientModelAdm.create({
            id: client.id.id,
            name: client.name,
            document: '123456444',
            email: client.email,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            updatedAt: client.updatedAt,
            createdAt: client.createdAt,
        })

        const products = [
            new Product({
                name: 'Product 1',
                description: 'Product 1 description',
                salesPrice: 157,
            }),
            new Product({
                name: 'Product 2',
                description: 'Product 2 description',
                salesPrice: 97,
            }),
        ];

        for (const p of products) {
            try {
                await ProductModelAdm.create({
                    id: p.id.id,
                    name: p.name,
                    description: p.description,
                    salesPrice: p.salesPrice,
                    purchasePrice: 15,
                    stock: 10,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                });
            } catch(e) {
                console.log('ERRO =========================================================================')
                console.log(e)
            }
        };

        const order1 = new Order({
            client,
            products
        });

        order1.approve();

        await repo.addOrder(order1);

        const outputOrder = await repo.findOrder(order1.id.id);

        expect(outputOrder.id.id).toBe(order1.id.id);
        expect(outputOrder.client.id.id).toBe(order1.client.id.id);
        expect(outputOrder.status).toBe(order1.status);
        expect(outputOrder.products[0].id.id).toBe(order1.products[0].id.id);
        expect(outputOrder.products[1].id.id).toBe(order1.products[1].id.id);
        expect(outputOrder.createdAt).toEqual(order1.createdAt);
        expect(outputOrder.updatedAt).toEqual(order1.updatedAt);

    })
})