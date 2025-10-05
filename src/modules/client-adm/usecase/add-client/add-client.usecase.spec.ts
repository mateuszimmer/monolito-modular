import ClienGateway from "../../gateway/client.gateway";
import AddClientUseCase from "./add-client.usecase";
import { InputAddClientUseCase, OutputAddClientUseCase } from "./add-client.usecase.dto";

const MockRepo= (): jest.MockedObject<ClienGateway>  => ({
    add: jest.fn(),
    find: jest.fn(),
});

describe('AddClientUsecase unit test', () => {

    it('should add a client', async () => {
        const repo = MockRepo();
        const useCase = new AddClientUseCase(repo);
        const repoSpy = jest.spyOn(repo, 'add');

        const input: InputAddClientUseCase = {
            name: 'Client Name',
            email: 'email@test.com',
            address: 'Client Address'
        };

        const result:OutputAddClientUseCase = await useCase.execute(input);

        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.email).toBe(input.email);
        expect(result.address).toBe(input.address);

        expect(repoSpy).toHaveBeenCalledTimes(1);
    })

});