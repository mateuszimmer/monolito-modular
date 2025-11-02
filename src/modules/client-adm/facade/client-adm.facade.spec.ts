import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientAdmFacadeFactory from "../factory/client-adm-facade.factory";
import { ClientModel } from "../repository/client.model";
import { InputAddClientAdmFacade, InputFindClientAdmFadade } from "./client-adm-facade.interface";

describe('ClientAdmFacade tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });
        sequelize.addModels([ ClientModel ]);
        await sequelize.sync();
    })

    afterEach(async () => {
        sequelize.close();
    })

    it('should create a client', async () => {
        const clientAdmFacade = ClientAdmFacadeFactory.create();

        const input: InputAddClientAdmFacade = {
            name: 'Client Name 1',
            email: 'email@test.com',
            document: 'document',
            street: 'StreetName',
            number: '123',
            complement: 'complement',
            city: 'city Name',
            state: 'State Name',
            zipCode: '123456',

        };

        const outputFacade = await clientAdmFacade.add(input)

        const client = await ClientModel.findOne({ where: { id: outputFacade.id } });

        expect(outputFacade.id).toBeDefined();
        expect(client.id).toBe(outputFacade.id);
        expect(client.name).toBe(input.name);
        expect(client.email).toBe(input.email);
        expect(client.document).toBe(input.document);
        expect(client.street).toBe(input.street);
        expect(client.number).toBe(input.number);
        expect(client.complement).toBe(input.complement);
        expect(client.city).toBe(input.city);
        expect(client.state).toBe(input.state);
        expect(client.zipCode).toBe(input.zipCode);
    });

    it('should create a client', async () => {
        const client = new Client({
            id: new Id(),
            name: 'ClientName123',
            email: 'mail@test.com',
            document: 'document',
            street: 'StreetName',
            number: '123',
            complement: 'complement',
            city: 'city Name',
            state: 'State Name',
            zipCode: '123456',
        })

        await ClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        })

        const clientAdmFacade = ClientAdmFacadeFactory.create();

        const input: InputFindClientAdmFadade = {
            id: client.id.id,
        };

        const outputFacade = await clientAdmFacade.find(input)

        expect(outputFacade.id).toBe(client.id.id);
        expect(outputFacade.name).toBe(client.name);
        expect(outputFacade.email).toBe(client.email);
        expect(outputFacade.document).toBe(client.document);
        expect(outputFacade.street).toBe(client.street);
        expect(outputFacade.number).toBe(client.number);
        expect(outputFacade.complement).toBe(client.complement);
        expect(outputFacade.city).toBe(client.city);
        expect(outputFacade.state).toBe(client.state);
        expect(outputFacade.zipCode).toBe(client.zipCode);
        expect(outputFacade.createdAt).toStrictEqual(client.createdAt);
        expect(outputFacade.updatedAt).toStrictEqual(client.updatedAt);
    });

})