import Request from 'supertest';
import Client from "../../../../modules/client-adm/domain/client.entity";
import { ClientModel as ClientModelAdm } from "../../../../modules/client-adm/repository/client.model";
import Product from "../../../../modules/product-adm/domain/product.entity";
import { ProductModel as ProductModelAdm } from "../../../../modules/product-adm/repository/product.model";
import { app, migration, sequelize } from "../../express";
import InvoiceRepository from '../../../../modules/invoice/repository/invoice.repository';
import GenerateInvoiceUseCase from '../../../../modules/invoice/usecase/generate-usecase/generate-invoice.usecase';
import Id from '../../../../modules/@shared/domain/value-object/id.value-object';
import Invoice from '../../../../modules/invoice/domain/entity/invoice.entity';
import InvoiceItem from '../../../../modules/invoice/domain/entity/invoice-item.entity';
import Address from '../../../../modules/invoice/domain/value-object/address.value-object';
import InvoiceItemModel from '../../../../modules/invoice/repository/invoice-item.model';
import InvoiceModel from '../../../../modules/invoice/repository/invoice.model';

describe('invoice e2e tests', () => {

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

        const invoice = new Invoice({
            name: 'Customer Name',
            document: '1234544312',
            address: new Address({
                street: 'Street',
                number: '123',
                complement: 'complement',
                city: 'city',
                state: 'state',
                zipCode: 'zipCode',
            }),
            items: [
                new InvoiceItem({
                    id: new Id('i1'),
                    name: 'item 1 name',
                    price: 17,
                }),
                new InvoiceItem({
                    id: new Id('i2'),
                    name: 'item 2 name',
                    price: 33,
                })
            ]
        })

        const repo = new InvoiceRepository();
        await repo.generate(invoice);
        
        const invoiceModel = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: [ InvoiceItemModel ]
        });

        expect(invoiceModel).toBeDefined();
        
        const response = await Request(app)
            .post(`/invoices/${invoice.id.id}`)
            .send();

        console.log(response.body)

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(invoice.id.id);
        expect(response.body.document).toBe(invoice.document);
        expect(response.body.address.street).toBe(invoice.address.street);
        expect(response.body.address.number).toBe(invoice.address.number);
        expect(response.body.address.complement).toBe(invoice.address.complement);
        expect(response.body.address.city).toBe(invoice.address.city);
        expect(response.body.address.state).toBe(invoice.address.state);
        expect(response.body.address.zipCode).toBe(invoice.address.zipCode);
        expect(response.body.items[0].id).toBe(invoice.items[0].id.id);
        expect(response.body.items[0].name).toBe(invoice.items[0].name);
        expect(response.body.items[0].price).toBe(invoice.items[0].price);
        expect(response.body.items[1].id).toBe(invoice.items[1].id.id);
        expect(response.body.items[1].name).toBe(invoice.items[1].name);
        expect(response.body.items[1].price).toBe(invoice.items[1].price);
        expect(response.body.total).toBe(invoice.total);
        expect(new Date(response.body.createdAt)).toStrictEqual(invoice.createdAt);
    })
})