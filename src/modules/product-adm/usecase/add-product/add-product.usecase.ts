import Id from "../../../@shared/domain/value-object/id.value-object";
import Product, { ProductConstructorProps } from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { AddProductInputDTO, AddProductOutputDTO } from "./add-product.dto";

export default class AddProductUseCase {
    private _repo: ProductGateway;

    constructor(aRepository: ProductGateway) {
        this._repo = aRepository;
    }

    async execute(input: AddProductInputDTO): Promise<AddProductOutputDTO> {
        const props = {
            id: new Id(input.id),
            name: input.name,
            description: input.description,
            purchasePrice: input.purchasePrice,
            stock: input.stock,
        } as ProductConstructorProps;

        const product = new Product(props);

        await this._repo.add(product);
        
        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        } as AddProductOutputDTO
    }
}