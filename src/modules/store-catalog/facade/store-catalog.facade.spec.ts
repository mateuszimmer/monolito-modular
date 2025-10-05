import { Sequelize } from "sequelize-typescript";
import StoreCatalogFacadeFactory from "../factory/store-catalog-facade.factory";
import ProductModel from "../repository/product.model";
import { OutputFindAllStoreCatalogFacadeDTO, OutputFindStoreCatalogFacadeDTO } from "./store-catalog-facade.interface";

describe('StoreCatalogFacade Tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });
        sequelize.addModels([ ProductModel ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        sequelize.close();
    });

    it('should return a product', async () => {
        await ProductModel.create({
            id: '1',
            name: 'ProductName',
            description: 'ProductDescription',
            salesPrice: 25
        });
        const facade = StoreCatalogFacadeFactory.create();
        const output: OutputFindStoreCatalogFacadeDTO = await facade.find({ productId: '1' });

        expect(output.productId).toBe('1');
        expect(output.name).toBe('ProductName');
        expect(output.description).toBe('ProductDescription');
        expect(output.salesPrice).toBe(25);
    })

    it('should return a list of product', async () => {
        await ProductModel.create({
            id: '1',
            name: 'ProductName1',
            description: 'ProductDescription1',
            salesPrice: 25
        });
        await ProductModel.create({
            id: '2',
            name: 'ProductName2',
            description: 'ProductDescription2',
            salesPrice: 250
        });
        const facade = StoreCatalogFacadeFactory.create();
        const output: OutputFindAllStoreCatalogFacadeDTO = await facade.findAll();

        expect(output.products[0].productId).toBe('1');
        expect(output.products[0].name).toBe('ProductName1');
        expect(output.products[0].description).toBe('ProductDescription1');
        expect(output.products[0].salesPrice).toBe(25);
        expect(output.products[1].productId).toBe('2');
        expect(output.products[1].name).toBe('ProductName2');
        expect(output.products[1].description).toBe('ProductDescription2');
        expect(output.products[1].salesPrice).toBe(250);
    })


})