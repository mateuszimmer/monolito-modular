import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductAdmFacade, { ProductAdmFacadeConstructorProps } from "./product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import { InputAddProductFacadeDTO, InputCheckStockFacadeDTO, OutputCheckStockFacadeDTO } from "./product-adm.facade.interface";
import ProductAdmFacadeFactory from "../factory/product-adm-facade.factory";

describe('ProductAdmFacade tests', () => {
    let sequelize: Sequelize

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
    })

    it('should create a product', async () => {
        const facade = ProductAdmFacadeFactory.create();

        const input = {
            id: '123',
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 15,
            stock: 100
        } as InputAddProductFacadeDTO;

        await facade.addProduct(input);

        const productDb = await ProductModel.findOne({ where: { id: '123' }});

        expect(productDb).toBeDefined();
        expect(productDb.id).toBe(input.id);
        expect(productDb.name).toBe(input.name);
        expect(productDb.description).toBe(input.description);
        expect(productDb.purchasePrice).toBe(input.purchasePrice);
        expect(productDb.stock).toBe(input.stock);
    });

    it('should return a product stock', async () => {
        const facade = ProductAdmFacadeFactory.create();

        const inputObject = {
            id: '123',
            name: 'Product 1',
            description: 'Product 1 description',
            purchasePrice: 15,
            stock: 100
        } as InputAddProductFacadeDTO;

        await facade.addProduct(inputObject);
        const productDb = await ProductModel.findOne({ where: { id: '123' }});
        expect(productDb).toBeDefined();

        const input = {
            productId: '123'
        } as InputCheckStockFacadeDTO;

        const output: OutputCheckStockFacadeDTO = await facade.checkStock(input);
        expect(output.productId).toBe('123');
        expect(output.stock).toBe(100);
    });

});