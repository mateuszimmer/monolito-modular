import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe('ProductReporitory test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('Should create a product', async () => {
        const product = new Product({
            id: new Id("1"),
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 100,
            salesPrice: 250,
            stock: 20
        });

        const productRepository = new ProductRepository();
        await productRepository.add(product);

        const productDb = await ProductModel.findOne({ where: { id: "1" }});

        expect(productDb.id).toBe(product.id.id);
        expect(productDb.name).toBe(product.name);
        expect(productDb.description).toBe(product.description);
        expect(productDb.purchasePrice).toBe(product.purchasePrice);
        expect(productDb.salesPrice).toBe(product.salesPrice);
        expect(productDb.stock).toBe(product.stock);
    });

    it('should find a product', async () => {
        const productModel = {
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 100,
            salesPrice: 250,
            stock: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await ProductModel.create(productModel);

        const productRepository = new ProductRepository();

        const productDb = await productRepository.find('1');

        expect(productDb.id.id).toBe(productModel.id);
        expect(productDb.name).toBe(productModel.name);
        expect(productDb.description).toBe(productModel.description);
        expect(productDb.purchasePrice).toBe(productModel.purchasePrice);
        expect(productDb.salesPrice).toBe(productModel.salesPrice);
        expect(productDb.stock).toBe(productModel.stock);
        expect(productDb.createdAt).toStrictEqual(productModel.createdAt);
        expect(productDb.updatedAt).toStrictEqual(productModel.updatedAt);
    }); 
});