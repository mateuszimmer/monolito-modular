import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import { OutputFindAllProductsDTO, OutputProduct } from "../usecase/find-all-products/find-all-products.dto";
import StoreCatalogFacadeInterface, { InputFindStoreCatalogFacadeDTO, OutputFindAllStoreCatalogFacadeDTO, OutputFindStoreCatalogFacadeDTO, ProductOutputFIndAllStoreCatalogFacade } from "./store-catalog-facade.interface";

export interface StoreCatalogFacadeConstructorProps {
    findProductUseCase: UseCaseInterface;
    findAllUseCase: UseCaseInterface;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface{

    private _findUseCase: UseCaseInterface;
    private _findAllUseCase: UseCaseInterface;

    constructor(input: StoreCatalogFacadeConstructorProps) {
        this._findUseCase = input.findProductUseCase;
        this._findAllUseCase = input.findAllUseCase;
    }

    async find(input: InputFindStoreCatalogFacadeDTO): Promise<OutputFindStoreCatalogFacadeDTO> {
        return await this._findUseCase.execute(input);
    }
    async findAll(): Promise<OutputFindAllStoreCatalogFacadeDTO> {
        const output: OutputFindAllProductsDTO = await this._findAllUseCase.execute({});
        return {
            products: output.products.map((e: OutputProduct):ProductOutputFIndAllStoreCatalogFacade => ({
                productId: e.id,
                name: e.name,
                description: e.description,
                salesPrice: e.salesPrice,
            }))
        } as OutputFindAllStoreCatalogFacadeDTO;
    }

}