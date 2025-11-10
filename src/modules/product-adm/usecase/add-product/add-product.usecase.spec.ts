import { AddProductInputDTO } from "./add-product.dto";
import AddProductUseCase from "./add-product.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
}

describe('AddProductUseCase unit test', () => {

    it('should add a product', async () => {
        // repository
        const productRepository = MockRepository();
        const addSpy = jest.spyOn(productRepository, 'add');
        productRepository.add.mockImplementation(async product => Promise.resolve(product));
        // input
        const input = {
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 100,
            salesPrice: 250,
            stock: 20
        } as AddProductInputDTO;
        // usecase
        const usecase = new AddProductUseCase(productRepository);
        // output
        const output = await usecase.execute(input);

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(output).toBeDefined();
        expect(output.id).toBeDefined();
        expect(output.name).toBe(input.name);
        expect(output.description).toBe(input.description);
        expect(output.purchasePrice).toBe(input.purchasePrice);
        expect(output.salesPrice).toBe(input.salesPrice);
        expect(output.stock).toBe(input.stock);
    });

})