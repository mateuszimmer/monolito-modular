import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ProductGateway from "../../gateway/product.gateway";
import ProductModel from "../../repository/product.model";
import { InputFindProductDTO, OutputFindProductDTO } from "./find-product.dto";

export default class FindProductUseCase implements UseCaseInterface {
    
    constructor(private _repo: ProductGateway) {}

    async execute(input: InputFindProductDTO): Promise<OutputFindProductDTO> {
        const output = await this._repo.find(input.productId);
        return {
            productId: output.id.id,
            name: output.name,
            description: output.description,
            salesPrice: output.salesPrice,
        } as OutputFindProductDTO;
    }
}