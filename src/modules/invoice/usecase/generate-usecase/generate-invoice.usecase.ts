import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import InvoiceItem from "../../domain/entity/invoice-item.entity";
import Invoice from "../../domain/entity/invoice.entity";
import Address from "../../domain/value-object/address.value-object";
import InvoiceGateway from "../../gateway/invoice-gateway.interface";
import { InputGenerateInvoiceDTO, OutputGenerateInvoiceDTO } from "./generate-invoice-usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {

    private _repo: InvoiceGateway;

    constructor(repo: InvoiceGateway) {
        this._repo = repo;
    }

    async execute(input: InputGenerateInvoiceDTO): Promise<OutputGenerateInvoiceDTO> {
        const items: InvoiceItem[] = input.items.map((i) => new InvoiceItem({
            id: new Id(i.id),
            name: i.name,
            price: i.price
        }));

        const address = new Address({
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode
        });

        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address,
            items
        });

        await this._repo.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: address.street,
            number: address.number,
            complement: address.complement,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            items: items.map(i => ({
                id: i.id.id,
                name: i.name,
                price: i.price,
            })),
            total: invoice.total
        } as OutputGenerateInvoiceDTO;
    }
}