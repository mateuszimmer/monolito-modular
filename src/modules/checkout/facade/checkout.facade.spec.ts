import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../../infrastructure/db/migrator";
import { ClientModel as ClientModelAdm } from "../../client-adm/repository/client.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import TransactionModel from "../../payment/repository/transaction.model";
import { ProductModel as ProductModelAdm } from "../../product-adm/repository/product.model";
import ProductModel from "../../store-catalog/repository/product.model";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import CheckoutFacadeFactory from "../factory/checkout-facade.factory";
import ClientModel from "../repository/client.model";
import { InputCheckoutFacadeInterface } from "./checkout-facade.interface";
import { Umzug } from "umzug";
import OrderModel from "../repository/order.model";
import OrderProductModel from "../repository/order-product.model";

describe('Checkout facade tests', () => {

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
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
        await migration.up();
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return
        }
        migration = migrator(sequelize);
        await migration.down();
        await sequelize.close();
    })

    it('should place an order', async () => {
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
            email: client.email,
            document: '99157865485',
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });

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

        products.forEach(async p => {
            await ProductModelAdm.create({
                id: p.id.id,
                name: p.name,
                description: p.description,
                purchasePrice: 15,
                stock: 15,
                salesPrice: p.salesPrice,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            });
        });
        
        const facade = CheckoutFacadeFactory.create();

        const inputFacade: InputCheckoutFacadeInterface = {
            clientId: client.id.id,
            products: products.map(p => {
                return {
                    productId: p.id.id
                }
            })
        }

        const output = await facade.placeOrder(inputFacade);

        expect(output.id).toBeDefined();
        expect(output.invoiceId).toBeDefined,
        expect(output.products[0].productId).toBe(products[0].id.id);
        expect(output.products[1].productId).toBe(products[1].id.id);
        expect(output.status).toBe('approved');
        expect(output.total).toBe(products[0].salesPrice + products[1].salesPrice)

    })

})