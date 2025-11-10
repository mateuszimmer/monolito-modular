import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { InputCheckStockDTO, OutputCheckStockDTO } from "./check-stock.dto";
import CheckStockUseCase from "./check-stock.usecase";


describe('CheckStockUseCase unit test', () => {
    
    const product = new Product({
        name: 'Product 1',
        description: 'Product 1 description',
        purchasePrice: 30,
        salesPrice: 75,
        stock: 3,
    });
    
    const MockRepository = () => ({
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    });

    it('should return stock quantity', async () => {
        const repo = MockRepository();
        const useCase = new CheckStockUseCase(repo);
        const findSpy = jest.spyOn(repo, 'find');

        const input = {
            productId: product.id.id
        } as InputCheckStockDTO;

        const output: OutputCheckStockDTO = await useCase.execute(input);

        expect(output.productId).toBe(product.id.id);
        expect(output.quantity).toBe(3);
        expect(findSpy).toHaveBeenCalledTimes(1);
    });
});