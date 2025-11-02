import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ClienGateway from "../../gateway/client.gateway";
import { InputFindClientUseCaseDTO, OutputFindClientUseCaseDTO } from "./find-client-usecase.dto";

export default class FindClientUseCase implements UseCaseInterface {
    
    constructor(private _repo: ClienGateway) {}
    
    async execute(input: InputFindClientUseCaseDTO): Promise<OutputFindClientUseCaseDTO> {
        const client = await this._repo.find(input.id);
        return {
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
        } as OutputFindClientUseCaseDTO;
    }
}