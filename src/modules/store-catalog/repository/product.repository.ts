import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway{
    async findAll(): Promise<Product[]> {
        const productModelList = await ProductModel.findAll();

        return productModelList.map((e): Product => new Product({
            id: new Id(e.id),
            name: e.name,
            description: e.description,
            salesPrice: e.salesPrice,
        }))
    }
    async find(id: string): Promise<Product> {
        const productModel = await ProductModel.findOne({ where: { id } })
        const teste = await ProductModel.findAll();
        if (!productModel) {
            throw new Error(`Não foi localizado produto com o id ${id}`)
        }

        return new Product({ 
            id: new Id(productModel.id),
            name: productModel.name,
            description: productModel.description,
            salesPrice: productModel.salesPrice, 
        });
    }
}