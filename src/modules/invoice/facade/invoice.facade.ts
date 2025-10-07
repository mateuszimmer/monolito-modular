import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import { OutputFindInvoiceDTO } from "../usecase/find-usecase/find-invoice-usecase.dto";
import InvoiceFacadeInterface, { InputInvoiceFacadeFindDTO, InputInvoiceFacadeGenerateDTO, OutputInvoiceFacadeFindDTO, OutputInvoiceFacadeGenerateDTO } from "./invoice-facade.interface";

export type InvoiceFacadeConstructorProps = {
    findUseCase: UseCaseInterface;
    generateUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;

    constructor(props: InvoiceFacadeConstructorProps) {
        this._findUseCase = props.findUseCase;
        this._generateUseCase = props.generateUseCase;
    }

    async find(input: InputInvoiceFacadeFindDTO): Promise<OutputInvoiceFacadeFindDTO> {
        const outputUseCase: OutputFindInvoiceDTO = await this._findUseCase.execute(input);
        return {
            id: outputUseCase.id,
            name: outputUseCase.name,
            document: outputUseCase.document,
            address: outputUseCase.address,
            items: outputUseCase.items,
            total: outputUseCase.total,
            createdAt: outputUseCase.createdAt,
        } as OutputInvoiceFacadeFindDTO;
    }
    async generate(input: InputInvoiceFacadeGenerateDTO): Promise<OutputInvoiceFacadeGenerateDTO> {
        const output = await this._generateUseCase.execute(input);
        return {
            id: output.id,
            name: output.name,
            document: output.document,
            street: output.street,
            number: output.number,
            complement: output.complement,
            city: output.city,
            state: output.state,
            zipCode: output.zipCode,
            total: output.total,
            items: output.items,
        } as OutputInvoiceFacadeGenerateDTO
    }
}