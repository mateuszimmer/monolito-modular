import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";

describe('ProductRepository tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        sequelize.close();
    });

    it('should find all products', async () => {
        await ProductModel.create({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            salesPrice: 10
        });
        await ProductModel.create({
            id: '2',
            name: 'Product 2',
            description: 'Product 2 description',
            salesPrice: 20
        });
        await ProductModel.create({
            id: '3',
            name: 'Product 3',
            description: 'Product 3 description',
            salesPrice: 30
        });

        const repository = new ProductRepository();
        const output = await repository.findAll();
        
        expect(output.length).toBe(3);
        expect(output[0].id.id).toBe('1');
        expect(output[0].name).toBe('Product 1');
        expect(output[0].description).toBe('Product 1 description');
        expect(output[0].salesPrice).toBe(10);
        expect(output[1].id.id).toBe('2');
        expect(output[1].name).toBe('Product 2');
        expect(output[1].description).toBe('Product 2 description');
        expect(output[1].salesPrice).toBe(20);
        expect(output[2].id.id).toBe('3');
        expect(output[2].name).toBe('Product 3');
        expect(output[2].description).toBe('Product 3 description');
        expect(output[2].salesPrice).toBe(30);
    });

    it('should return 1 product', async () => {
        await ProductModel.create({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            salesPrice: 10
        });
        await ProductModel.create({
            id: '2',
            name: 'Product 2',
            description: 'Product 2 description',
            salesPrice: 20
        });
        await ProductModel.create({
            id: '3',
            name: 'Product 3',
            description: 'Product 3 description',
            salesPrice: 30
        });

        const repository = new ProductRepository();
        const output = await repository.find('2');

        expect(output.id.id).toBe('2');
        expect(output.name).toBe('Product 2');
        expect(output.description).toBe('Product 2 description');
        expect(output.salesPrice).toBe(20);

    })
});