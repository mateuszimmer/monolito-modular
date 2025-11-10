import Request from 'supertest';
import { ProductModel as ProductModelAdm } from "../../../../modules/product-adm/repository/product.model";
import { app, migration, sequelize } from "../../express";

describe('product e2e tests', () => {

    beforeEach(async () => {
        await migration.up();
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return;
        }
        await migration.down();
        await sequelize.close();
    })

    it('Should create a product', async () => {
        const response = await Request(app)
            .post('/products')
            .send({
                name: 'product 1 name',
                description: 'product 1 descriptuin',
                purchasePrice: 30,
                salesPrice: 90,
                stock: 5,
            });

        const productModel = await ProductModelAdm.findOne({ where: { id: response.body.productId } });
        
        expect(response.status).toBe(200);
        expect(response.body.productId).toBeDefined();
        expect(productModel.name).toBe('product 1 name');
        expect(productModel.description).toBe('product 1 descriptuin');
        expect(productModel.purchasePrice).toBe(30);
        expect(productModel.salesPrice).toBe(90);
        expect(productModel.stock).toBe(5);
    })
})