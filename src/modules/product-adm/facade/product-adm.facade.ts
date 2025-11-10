import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import { AddProductOutputDTO } from "../usecase/add-product/add-product.dto";
import { OutputCheckStockDTO } from "../usecase/check-stock/check-stock.dto";
import ProductAdmFacadeInterface, { InputAddProductFacadeDTO, InputCheckStockFacadeDTO, OutputCheckStockFacadeDTO } from "./product-adm.facade.interface";

export type ProductAdmFacadeConstructorProps = {
    addProductUseCase?: UseCaseInterface;
    checkStockUseCase?: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {

    private _addProductUseCase: UseCaseInterface;
    private _checkStockUseCase: UseCaseInterface;

    constructor(props: ProductAdmFacadeConstructorProps) {
        this._addProductUseCase = props.addProductUseCase;
        this._checkStockUseCase = props.checkStockUseCase;
    }

    async addProduct(input: InputAddProductFacadeDTO): Promise<InputCheckStockFacadeDTO> {
        const output = await this._addProductUseCase.execute(input);
        return {
            productId: output.id
        }
    }
    async checkStock(input: InputCheckStockFacadeDTO): Promise<OutputCheckStockFacadeDTO> {
        const output: OutputCheckStockDTO = await this._checkStockUseCase.execute(input);
        return {
            productId: output.productId,
            stock: output.quantity
        } as OutputCheckStockFacadeDTO;
    }

}