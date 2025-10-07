import InvoiceGateway from "../../gateway/invoice-gateway.interface";
import { InputGenerateInvoiceDTO, OutputGenerateInvoiceDTO } from "./generate-invoice-usecase.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe('GenerateInvoiceUseCase unit tests', () => {

    const MockedRepo = (): jest.MockedObject<InvoiceGateway> => ({
        generate: jest.fn().mockImplementation(input => Promise.resolve()),
        find: jest.fn(),
    });

    it('should generate a invoice', async () => {
        const repo = MockedRepo();
        const useCase = new GenerateInvoiceUseCase(repo);
        const generateSpy = jest.spyOn(repo, 'generate');

        const items = [
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

        const input: InputGenerateInvoiceDTO = {
            name: 'Name test 1',
            document: '123.456.789-00',
            street: 'Main St.',
            number: '2233',
            complement: 'Complement 01',
            city: 'City Name',
            state: 'State 1',
            zipCode: '123456',
            items
        }

        const output: OutputGenerateInvoiceDTO = await useCase.execute(input);

        expect(generateSpy).toHaveBeenCalledTimes(1);
        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.document).toBe(input.document);
        expect(output.street).toBe(input.street);
        expect(output.number).toBe(input.number);
        expect(output.complement).toBe(input.complement);
        expect(output.city).toBe(input.city);
        expect(output.state).toBe(input.state);
        expect(output.zipCode).toBe(input.zipCode);
        expect(output.items[0].id).toBe(items[0].id);
        expect(output.items[0].name).toBe(items[0].name);
        expect(output.items[0].price).toBe(items[0].price);
        expect(output.items[1].id).toBe(items[1].id);
        expect(output.items[1].name).toBe(items[1].name);
        expect(output.items[1].price).toBe(items[1].price);
        expect(output.total).toBe(items[0].price + items[1].price);
    });

});