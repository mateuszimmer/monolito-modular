import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Address from "../domain/value-object/address.value-object";
import InvoiceItem from "../domain/entity/invoice-item.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import 'reflect-metadata';

describe('InvoiceRepository tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
            models: [ InvoiceModel, InvoiceItemModel ],
        });
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a invoiceModel', async () => {

        const address = new Address({
            street: 'Main St.',
            number: '2233',
            complement: 'Complement 01',
            city: 'City Name',
            state: 'State 1',
            zipCode: '123456',
        })

        const item1 = new InvoiceItem({
            id: new Id('item-01'),
            name: 'Item Name 01',
            price: 25,
        });

        const item2 = new InvoiceItem({
            id: new Id('item-02'),
            name: 'Item Name 02',
            price: 3,
        });

        const invoice = new Invoice({
            name: 'Name test 1',
            document: '123.456.789-00',
            address,
            items: [item1, item2]
        });

        const repo = new InvoiceRepository();
        await repo.generate(invoice);

        const invoiceModel = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: [InvoiceItemModel],
        })

        expect(invoiceModel.id).toBe(invoice.id.id);
        expect(invoiceModel.name).toBe(invoice.name);
        expect(invoiceModel.document).toBe(invoice.document);
        expect(invoiceModel.street).toBe(address.street);
        expect(invoiceModel.number).toBe(address.number);
        expect(invoiceModel.complement).toBe(address.complement);
        expect(invoiceModel.city).toBe(address.city);
        expect(invoiceModel.state).toBe(address.state);
        expect(invoiceModel.zipCode).toBe(address.zipCode);
        expect(invoiceModel.items.length).toBe(2);
        expect(invoiceModel.items[0].id).toBe(item1.id.id);
        expect(invoiceModel.items[0].name).toBe(item1.name);
        expect(invoiceModel.items[0].price).toBe(item1.price);
        expect(invoiceModel.items[0].createdAt).toEqual(item1.createdAt);
        expect(invoiceModel.items[0].updatedAt).toEqual(item1.updatedAt);
        expect(invoiceModel.items[1].id).toBe(item2.id.id);
        expect(invoiceModel.items[1].name).toBe(item2.name);
        expect(invoiceModel.items[1].price).toBe(item2.price);
        expect(invoiceModel.items[1].createdAt).toEqual(item2.createdAt);
        expect(invoiceModel.items[1].updatedAt).toEqual(item2.updatedAt);

        const itemModel1 = await InvoiceItemModel.findOne({ where: { id: item1.id.id } });
        expect(itemModel1.id).toBe(item1.id.id);
        expect(itemModel1.name).toBe(item1.name);
        expect(itemModel1.price).toBe(item1.price);
        expect(itemModel1.createdAt).toEqual(item1.createdAt);
        expect(itemModel1.updatedAt).toEqual(item1.updatedAt);

        const itemModel2 = await InvoiceItemModel.findOne({ where: { id: item2.id.id } });
        expect(itemModel2.id).toBe(item2.id.id);
        expect(itemModel2.name).toBe(item2.name);
        expect(itemModel2.price).toBe(item2.price);
        expect(itemModel2.createdAt).toEqual(item2.createdAt);
        expect(itemModel2.updatedAt).toEqual(item2.updatedAt);
    });

    it('should find a invoice', async () => {
        const address = new Address({
            street: 'Main St.',
            number: '2233',
            complement: 'Complement 01',
            city: 'City Name',
            state: 'State 1',
            zipCode: '123456',
        })

        const item1 = new InvoiceItem({
            id: new Id('item-01'),
            name: 'Item Name 01',
            price: 25,
        });

        const item2 = new InvoiceItem({
            id: new Id('item-02'),
            name: 'Item Name 02',
            price: 3,
        });

        const invoice = new Invoice({
            name: 'Name test 1',
            document: '123.456.789-00',
            address,
            items: [item1, item2]
        });

        const repo = new InvoiceRepository();
        await repo.generate(invoice);

        const invoiceModel = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: [InvoiceItemModel],
        })

        expect(invoiceModel).toBeDefined();
        expect(invoiceModel.items.length).toBe(2);

        const output = await repo.find(invoice.id.id);

        expect(output.id.id).toBe(invoice.id.id);
        expect(output.name).toBe(invoice.name);
        expect(output.document).toBe(invoice.document);
        expect(output.address.street).toBe(address.street);
        expect(output.address.number).toBe(address.number);
        expect(output.address.complement).toBe(address.complement);
        expect(output.address.city).toBe(address.city);
        expect(output.address.state).toBe(address.state);
        expect(output.address.zipCode).toBe(address.zipCode);
        expect(output.items.length).toBe(2);
        expect(output.items[0].id.id).toBe(item1.id.id);
        expect(output.items[0].name).toBe(item1.name);
        expect(output.items[0].price).toBe(item1.price);
        expect(output.items[0].createdAt).toEqual(item1.createdAt);
        expect(output.items[0].updatedAt).toEqual(item1.updatedAt);
        expect(output.items[1].id.id).toBe(item2.id.id);
        expect(output.items[1].name).toBe(item2.name);
        expect(output.items[1].price).toBe(item2.price);
        expect(output.items[1].createdAt).toEqual(item2.createdAt);
        expect(output.items[1].updatedAt).toEqual(item2.updatedAt);

    })

})