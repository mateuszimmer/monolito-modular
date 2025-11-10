import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import { InputAddClientUseCase } from "../usecase/add-client/add-client.usecase.dto";
import { InputFindClientUseCaseDTO } from "../usecase/find-client/find-client-usecase.dto";
import ClientAdmFacadeInterface, { InputAddClientAdmFacade, InputFindClientAdmFadade, OutputAddClientAdmFacade, OutputFindClientAdmFacade } from "./client-adm-facade.interface";

export type ClientAdmFacadeConstructorParams = {
    addUseCase: UseCaseInterface,
    findUseCase: UseCaseInterface,
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

    private _addUseCase: UseCaseInterface;
    private _findUseCase: UseCaseInterface;

    constructor(input: ClientAdmFacadeConstructorParams) {
        this._addUseCase = input.addUseCase;
        this._findUseCase = input.findUseCase;
    }

    async add(input: InputAddClientAdmFacade): Promise<OutputAddClientAdmFacade> {
        const inputUseCase: InputAddClientUseCase = {
            ... input,
        }
        const output = await this._addUseCase.execute(inputUseCase);
        return {
            id: output.id,
        } as OutputAddClientAdmFacade;
    };

    async find(input: InputFindClientAdmFadade): Promise<OutputFindClientAdmFacade> {
        const inputUseCase: InputFindClientUseCaseDTO = {
            ... input,
        };
        const outputUseCase = await this._findUseCase.execute(inputUseCase);
        return {
            id: outputUseCase.id,
            name: outputUseCase.name,
            email: outputUseCase.email,
            document: outputUseCase.document,
            street: outputUseCase.street,
            number: outputUseCase.number,
            complement: outputUseCase.complement,
            city: outputUseCase.city,
            state: outputUseCase.state,
            zipCode: outputUseCase.zipCode,
            createdAt: outputUseCase.createdAt,
            updatedAt: outputUseCase.updatedAt,
        } as OutputFindClientAdmFacade
    }
}