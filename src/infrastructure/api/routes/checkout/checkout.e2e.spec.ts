import Request from 'supertest';
import Client from "../../../../modules/client-adm/domain/client.entity";
import { ClientModel as ClientModelAdm } from "../../../../modules/client-adm/repository/client.model";
import Product from "../../../../modules/product-adm/domain/product.entity";
import { ProductModel as ProductModelAdm } from "../../../../modules/product-adm/repository/product.model";
import { app, migration, sequelize } from "../../express";

describe('checkout e2e tests', () => {

    beforeEach(async () => {
        await migration.up();
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return;
        }
        await migration.down();
        await sequelize.close();
    })

    it('Should place an order', async () => {
        const client = new Client({
            name: 'Jonh Wick',
            email: 'john@wick.com',
            street: 'Main St.',
            document: '12345655557',
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
            document: client.document,
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
                purchasePrice: 50,
                stock: 10,
                salesPrice: 157,
            }),
            new Product({
                name: 'Product 2',
                description: 'Product 2 description',
                salesPrice: 97,
                purchasePrice: 45,
                stock: 15,
            }),
        ];

        for(const p of products) {
            await ProductModelAdm.create({
                id: p.id.id,
                name: p.name,
                description: p.description,
                purchasePrice: p.purchasePrice,
                stock: p.stock,
                salesPrice: p.salesPrice,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            });
        };

        const response = await Request(app)
            .post('/checkouts')
            .send({
                clientId: client.id.id,
                products: [
                    {
                        productId: products[0].id.id,
                    },
                    {
                        productId: products[1].id.id,
                    }
                ]
            });
            
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toBe('approved');
        expect(response.body.products[0].productId).toBe(products[0].id.id);
        expect(response.body.products[1].productId).toBe(products[1].id.id);
    })
})