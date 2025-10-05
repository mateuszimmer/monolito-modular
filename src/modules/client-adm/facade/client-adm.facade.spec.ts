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
            address: 'Client address, 123',
        };

        const outputFacade = await clientAdmFacade.add(input)

        const client = await ClientModel.findOne({ where: { id: outputFacade.id } });

        expect(outputFacade.id).toBeDefined();
        expect(client.id).toBe(outputFacade.id);
        expect(client.name).toBe(input.name);
        expect(client.email).toBe(input.email);
        expect(client.address).toBe(input.address);
    });

    it('should create a client', async () => {
        const client = new Client({
            id: new Id(),
            name: 'ClientName123',
            email: 'mail@test.com',
            address: 'Address 123',
        })

        await ClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            address: client.address,
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
        expect(outputFacade.address).toBe(client.address);
        expect(outputFacade.createdAt).toStrictEqual(client.createdAt);
        expect(outputFacade.updatedAt).toStrictEqual(client.updatedAt);
    });

})