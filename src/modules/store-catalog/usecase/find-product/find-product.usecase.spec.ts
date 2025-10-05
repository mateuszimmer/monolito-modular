import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductRepository from "../../repository/product.repository";
import { InputFindProductDTO, OutputFindProductDTO } from "./find-product.dto";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
            id: new Id('3324'),
            name: 'Product Name 1',
            description: 'Product Description 2',
            salesPrice: 50,
        });

const MokedRepo = (): jest.MockedObject<ProductRepository> => ({
    find: jest.fn().mockResolvedValue(Promise.resolve(product)),
    findAll: jest.fn()
})

describe('FindProductUseCase unit test', () => {

    it('should find a product', async () => {
        const repo = MokedRepo();
        const useCase = new FindProductUseCase(repo);
        const findSpy = jest.spyOn(repo, 'find');

        const input = {
            productId: '3324',
        } as InputFindProductDTO;

        const output: OutputFindProductDTO = await useCase.execute(input);

        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(output.productId).toBe(product.id.id);
        expect(output.name).toBe(product.name);
        expect(output.description).toBe(product.description);
        expect(output.salesPrice).toBe(product.salesPrice);
    });
});