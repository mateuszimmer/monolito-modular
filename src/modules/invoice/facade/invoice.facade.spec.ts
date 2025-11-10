import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-usecase/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import FindInvoiceUseCase from "../usecase/find-usecase/find-invoice.usecase";
import InvoiceFacadeFactory from "../factory/invoice-facade.factory";
import ClientModel from "../../checkout/repository/client.model";

describe('InvoiceFacade tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
            models: [ InvoiceModel, InvoiceItemModel, ClientModel ],
        });
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should generate a invoice', async () => {
        const facade = InvoiceFacadeFactory.create();

        const input = {
            name: 'Name test 1',
            document: '123.456.789-00',
            street: 'Main St.',
            number: '2233',
            complement: 'Complement 01',
            city: 'City Name',
            state: 'State 1',
            zipCode: '123456',
            items: [
                {
                    id: 'item-01',
                    name: 'Item Name 01',
                    price: 25,
                },
                {
                    id: 'item-02',
                    name: 'Item Name 02',
                    price: 3,
                },
            ]
        };

        const output = await facade.generate(input);

        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.document).toBe(input.document);
        expect(output.total).toBe(input.items.map(i => i.price).reduce((a, b) => a + b));
        expect(output.street).toBe(input.street);
        expect(output.number).toBe(input.number);
        expect(output.complement).toBe(input.complement);
        expect(output.city).toBe(input.city);
        expect(output.state).toBe(input.state);
        expect(output.zipCode).toBe(input.zipCode);
    })

    it('should return a invoice', async () => {
        const facade = InvoiceFacadeFactory.create();

        const inputGenerate = {
            name: 'Name test 1',
            document: '123.456.789-00',
            street: 'Main St.',
            number: '2233',
            complement: 'Complement 01',
            city: 'City Name',
            state: 'State 1',
            zipCode: '123456',
            items: [
                {
                    id: 'item-01',
                    name: 'Item Name 01',
                    price: 25,
                },
                {
                    id: 'item-02',
                    name: 'Item Name 02',
                    price: 3,
                },
            ]
        };

        const saved = await facade.generate(inputGenerate);

        expect(saved.id).toBeDefined();

        const input = {
            id: saved.id
        };

        const output = await facade.find(input);

        expect(output.id).toBe(saved.id);
        expect(output.name).toBe(saved.name);
        expect(output.document).toBe(saved.document);
        expect(output.address.street).toBe(saved.street);
        expect(output.address.number).toBe(saved.number);
        expect(output.address.complement).toBe(saved.complement);
        expect(output.address.city).toBe(saved.city);
        expect(output.address.state).toBe(saved.state);
        expect(output.address.zipCode).toBe(saved.zipCode);
        expect(output.total).toBe(saved.total);
    })

})