import Client from "../../domain/client.entity";
import ClienGateway from "../../gateway/client.gateway";
import { InputFindClientUseCaseDTO, OutputFindClientUseCaseDTO } from "./find-client-usecase.dto";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
    name: 'Client Name',
    email: 'Client Email',
    document: 'document',
    street: 'StreetName',
    number: '123',
    complement: 'complement',
    city: 'city Name',
    state: 'State Name',
    zipCode: '123456',
})

const MockRepo = (): jest.MockedObject<ClienGateway> => ({
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
})

describe('FindClientUseCase unit tests', () => {
    it('should return a client', async () => {
        const repo = MockRepo();
        const useCase = new FindClientUseCase(repo);
        const findSpy = jest.spyOn(repo, 'find');
        const input: InputFindClientUseCaseDTO = {
            id: client.id.id,
        }
        const output: OutputFindClientUseCaseDTO = await useCase.execute(input);

        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(output.id).toBe(client.id.id);
        expect(output.name).toBe(client.name);
        expect(output.email).toBe(client.email);
        expect(output.document).toBe(client.document);
        expect(output.street).toBe(client.street);
        expect(output.number).toBe(client.number);
        expect(output.complement).toBe(client.complement);
        expect(output.city).toBe(client.city);
        expect(output.state).toBe(client.state);
        expect(output.zipCode).toBe(client.zipCode);
        expect(output.createdAt).toBe(client.createdAt);
        expect(output.updatedAt).toBe(client.updatedAt);
    });
});