import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "./client.model";
import Client from "../domain/client.entity";
import ClientRepository from "./client.repository";

describe('ClientRepository tests', () => {
    
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
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should add a client', async () => {
        const client = new Client({
            name: 'clientName',
            address: 'clientAddress',
            email: 'clientEmail',
        });

        const repository = new ClientRepository();
        await repository.add(client);

        const clientModel = await ClientModel.findOne({ where: { id: client.id.id } });

        expect(clientModel.id).toBe(client.id.id);
        expect(clientModel.name).toBe(client.name);
        expect(clientModel.email).toBe(client.email);
        expect(clientModel.address).toBe(client.address);
        expect(clientModel.createdAt).toStrictEqual(client.createdAt);
        expect(clientModel.updatedAt).toStrictEqual(client.updatedAt);
    });

    it('should find a client', async () => {
        const client = new Client({
            name: 'clientName',
            address: 'clientAddress',
            email: 'clientEmail',
        });

        const repository = new ClientRepository();
        await repository.add(client);

        const clientOutput = await repository.find(client.id.id);

        expect(clientOutput.id).toStrictEqual(client.id);
        expect(clientOutput.name).toBe(client.name);
        expect(clientOutput.email).toBe(client.email);
        expect(clientOutput.address).toBe(client.address);
        expect(clientOutput.createdAt).toStrictEqual(client.createdAt);
        expect(clientOutput.updatedAt).toStrictEqual(client.updatedAt);
    });

});
