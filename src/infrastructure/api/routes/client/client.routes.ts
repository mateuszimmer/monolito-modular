import express, { Request, Response } from 'express';
import ClientAdmFacadeFactory from '../../../../modules/client-adm/factory/client-adm-facade.factory';
import { InputAddClientAdmFacade } from '../../../../modules/client-adm/facade/client-adm-facade.interface';

export const clientRouter = express.Router();

clientRouter.post('/', async (req: Request, res: Response) => {
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    try {
        const facadeInput: InputAddClientAdmFacade = {
            name: req.body.name,
            document: req.body.document,
            email: req.body.email,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        }
        const output = await clientAdmFacade.add(facadeInput);
        res.status(200).send(output);
    } catch (e) {
        res.status(500).send(e);
    }
})