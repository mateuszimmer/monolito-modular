import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../../domain/entity/invoice-item.entity"
import Invoice from "../../domain/entity/invoice.entity"
import Address from "../../domain/value-object/address.value-object"
import InvoiceGateway from "../../gateway/invoice-gateway.interface"
import { OutputFindInvoiceDTO } from "./find-invoice-usecase.dto"
import FindInvoiceUseCase from "./find-invoice.usecase"

describe('FindInvoiceUseCase unit tests', () => {
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

    const MockRepo = (): jest.MockedObject<InvoiceGateway> => ({
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        generate: jest.fn(),
    });

    it('should return a FindInvoiceOutputDTO', async () => {
        const repo = MockRepo();
        const useCase = new FindInvoiceUseCase(repo);
        const findSpy = jest.spyOn(repo, 'find');

        const output: OutputFindInvoiceDTO = await useCase.execute({ id: invoice.id.id });

        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(findSpy).toHaveBeenCalledWith(invoice.id.id);
        expect(output.id).toBe(invoice.id.id);
        expect(output.name).toBe(invoice.name);
        expect(output.document).toBe(invoice.document);
        expect(output.createdAt).toStrictEqual(invoice.createdAt);
        expect(output.total).toBe(invoice.total);
        expect(output.items[0].id).toBe(item1.id.id);
        expect(output.items[0].name).toBe(item1.name);
        expect(output.items[0].price).toBe(item1.price);
        expect(output.items[1].id).toBe(item2.id.id);
        expect(output.items[1].name).toBe(item2.name);
        expect(output.items[1].price).toBe(item2.price);
    })
})