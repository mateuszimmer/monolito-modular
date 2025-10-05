import Client from "../../domain/client.entity";
import ClienGateway from "../../gateway/client.gateway";
import { InputFindClientUseCaseDTO, OutputFindClientUseCaseDTO } from "./find-client-usecase.dto";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
    name: 'Client Name',
    email: 'Client Email',
    address: 'Address',
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
        expect(output.address).toBe(client.address);
        expect(output.createdAt).toBe(client.createdAt);
        expect(output.updatedAt).toBe(client.updatedAt);
    });
});