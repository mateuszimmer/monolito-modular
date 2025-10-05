import StoreCatalogFacade from "../facade/store-catalog.facade";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";

export default class StoreCatalogFacadeFactory {
    static create(): StoreCatalogFacade {
        const repository = new ProductRepository();
        const findProductUseCase = new FindProductUseCase(repository);
        const findAllUseCase = new FindAllProductsUseCase(repository);

        const storeCatalogFacade = new StoreCatalogFacade({findProductUseCase, findAllUseCase});
        return storeCatalogFacade;
    }
}