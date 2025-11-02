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
            document: 'document',
            street: 'StreetName',
            number: '123',
            complement: 'complement',
            city: 'city Name',
            state: 'State Name',
            zipCode: '123456',
        };

        const result:OutputAddClientUseCase = await useCase.execute(input);

        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.email).toBe(input.email);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);

        expect(repoSpy).toHaveBeenCalledTimes(1);
    })

});