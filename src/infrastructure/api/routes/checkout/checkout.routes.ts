import express, { Request, Response } from 'express';
import ProductAdmFacadeInterface, { InputAddProductFacadeDTO } from '../../../../modules/product-adm/facade/product-adm.facade.interface';
import ProductAdmFacadeFactory from '../../../../modules/product-adm/factory/product-adm-facade.factory';
import CheckoutFacadeFactory from '../../../../modules/checkout/factory/checkout-facade.factory';
import { InputCheckoutFacadeInterface } from '../../../../modules/checkout/facade/checkout-facade.interface';

export const checkoutRouter = express.Router();

checkoutRouter.post('/', async (req: Request, res: Response) => {
    const checkoutFacade = CheckoutFacadeFactory.create();
    try {
        const input: InputCheckoutFacadeInterface = {
            clientId: req.body.clientId,
            products: req.body.products
        };
        const output = await checkoutFacade.placeOrder(input);
        res.status(200).send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});