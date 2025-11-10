import express, { Request, Response } from 'express';
import ProductAdmFacadeInterface, { InputAddProductFacadeDTO } from '../../../../modules/product-adm/facade/product-adm.facade.interface';
import ProductAdmFacadeFactory from '../../../../modules/product-adm/factory/product-adm-facade.factory';

export const productRouter = express.Router();

productRouter.post('/', async (req: Request, res: Response) => {
    const productAdmFacade: ProductAdmFacadeInterface = ProductAdmFacadeFactory.create();
    try {
        const input: InputAddProductFacadeDTO = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            salesPrice: req.body.salesPrice,
            stock: req.body.stock,
            id: req.body.id,
        };

        const output = await productAdmFacade.addProduct(input);
        res.status(200).send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});