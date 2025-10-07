import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import InvoiceGateway from "../../gateway/invoice-gateway.interface";
import { InputFindInvoiceDTO, OutputFindInvoiceDTO } from "./find-invoice-usecase.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
    
    private _repo: InvoiceGateway;

    constructor(repository: InvoiceGateway) {
        this._repo = repository
    }
    
    async execute(input: InputFindInvoiceDTO): Promise<OutputFindInvoiceDTO> {
        const invoice = await this._repo.find(input.id);
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            createdAt: invoice.createdAt,
            total: invoice.total,
            items: invoice.items.map(i => ({
                id: i.id.id,
                name: i.name,
                price: i.price,
            }))
        } as OutputFindInvoiceDTO;
    }

}