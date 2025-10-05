import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import Client, { ClientConstructorProps } from "../../domain/client.entity";
import ClienGateway from "../../gateway/client.gateway";
import { InputAddClientUseCase, OutputAddClientUseCase } from "./add-client.usecase.dto";

export default class AddClientUseCase implements UseCaseInterface{
    
    constructor(
        private _repo: ClienGateway,
    ) {}
    
    async execute(input: InputAddClientUseCase): Promise<OutputAddClientUseCase> {
        const inputProps: ClientConstructorProps = {
            name: input.name,
            email: input.email,
            address: input.address
        };
        const clientInput = new Client(inputProps);
        await this._repo.add(clientInput);
        return {
            id: clientInput.id.id,
            name: clientInput.name,
            email: clientInput.email,
            address: clientInput.address,
            createdAt: clientInput.createdAt,
            updatedAt: clientInput.updatedAt,
        } as OutputAddClientUseCase;
    }
}