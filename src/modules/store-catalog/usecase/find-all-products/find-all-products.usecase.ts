import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ProductGateway from "../../gateway/product.gateway";
import { OutputFindAllProductsDTO, OutputProduct } from "./find-all-products.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {
    private _repo: ProductGateway;
    
    constructor(repository: ProductGateway) {
        this._repo = repository;
    }

    async execute(): Promise<OutputFindAllProductsDTO> {
        const output = await this._repo.findAll();
        return {
            products: output.map((e): OutputProduct  => ({
                id: e.id.id,
                name: e.name,
                description: e.description,
                salesPrice: e.salesPrice,
            })),
        };
    }

}