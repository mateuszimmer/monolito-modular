import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ProductGateway from "../../gateway/product.gateway";
import { InputCheckStockDTO, OutputCheckStockDTO } from "./check-stock.dto";


export default class CheckStockUseCase implements UseCaseInterface {

    private _repo: ProductGateway;

    constructor(repository: ProductGateway) {
        this._repo = repository;
    }

    public async execute(input: InputCheckStockDTO): Promise<OutputCheckStockDTO> {
        const productModel = await this._repo.find(input.productId);
        return {
            productId: productModel.id.id,
            quantity: productModel.stock,
        } as OutputCheckStockDTO;
    }
}