import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import ProductGateway from "../../gateway/product.gateway"
import FindAllProductsUseCase from "./find-all-products.usecase";

describe('FindAllProductsUseCase unit tests', () => {

    it('should return a list of products', async () => {
        const product1 = new Product({
            id: new Id('1'),
            name: 'Product 1 name',
            description: 'Product 1 description',
            salesPrice: 100
        })
        const product2 = new Product({
            id: new Id('2'),
            name: 'Product 2 name',
            description: 'Product 2 description',
            salesPrice: 200
        })
        const product3 = new Product({
            id: new Id('3'),
            name: 'Product 3 name',
            description: 'Product 3 description',
            salesPrice: 300
        })
        
        const products = [product1, product2, product3];
        
        const mockRepo = ():jest.MockedObject<ProductGateway> => ({
            find: jest.fn(),
            findAll: jest.fn().mockReturnValue(Promise.resolve(products)),
        });

        const repo = mockRepo();
        const useCase = new FindAllProductsUseCase(repo);

        const findAllSpy = jest.spyOn(repo, 'findAll');

        const output = await useCase.execute();

        expect(findAllSpy).toHaveBeenCalledTimes(1);
        expect(output.products.length).toBe(3);
        expect(output.products[0].id).toBe(product1.id.id);
        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[0].description).toBe(product1.description);
        expect(output.products[0].salesPrice).toBe(product1.salesPrice);
        expect(output.products[1].id).toBe(product2.id.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].description).toBe(product2.description);
        expect(output.products[1].salesPrice).toBe(product2.salesPrice);
        expect(output.products[2].id).toBe(product3.id.id);
        expect(output.products[2].name).toBe(product3.name);
        expect(output.products[2].description).toBe(product3.description);
        expect(output.products[2].salesPrice).toBe(product3.salesPrice);
    });
});