import express, { Request, Response } from 'express';
import { InputInvoiceFacadeFindDTO } from '../../../../modules/invoice/facade/invoice-facade.interface';
import InvoiceFacadeFactory from '../../../../modules/invoice/factory/invoice-facade.factory';

export const invoiceRouter = express.Router();

invoiceRouter.post('/:id', async (req: Request, res: Response) => {
    const invoiceFacade = InvoiceFacadeFactory.create();
    try {
        const { id } = req.params;
        const input: InputInvoiceFacadeFindDTO = {
            id
        };
        const output = await invoiceFacade.find(input);
        res.status(200).send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});