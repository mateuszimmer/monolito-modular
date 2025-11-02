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
            email: 'clientEmail',
            document: 'document',
            street: 'street name',
            number: '123',
            complement: 'complement',
            city: 'city name',
            state: 'state name',
            zipCode: '12345',
        });

        const repository = new ClientRepository();
        await repository.add(client);

        const clientModel = await ClientModel.findOne({ where: { id: client.id.id } });

        expect(clientModel.id).toBe(client.id.id);
        expect(clientModel.name).toBe(client.name);
        expect(clientModel.email).toBe(client.email);
        expect(clientModel.document).toBe(client.document);
        expect(clientModel.street).toBe(client.street);
        expect(clientModel.number).toBe(client.number);
        expect(clientModel.complement).toBe(client.complement);
        expect(clientModel.city).toBe(client.city);
        expect(clientModel.state).toBe(client.state);
        expect(clientModel.zipCode).toBe(client.zipCode);
        expect(clientModel.createdAt).toStrictEqual(client.createdAt);
        expect(clientModel.updatedAt).toStrictEqual(client.updatedAt);
    });

    it('should find a client', async () => {
        const client = new Client({
            name: 'clientName',
            email: 'clientEmail',
            document: 'document',
            street: 'street name',
            number: '123',
            complement: 'complement',
            city: 'city name',
            state: 'state name',
            zipCode: '12345',
        });

        const repository = new ClientRepository();
        await repository.add(client);

        const clientOutput = await repository.find(client.id.id);

        expect(clientOutput.id).toStrictEqual(client.id);
        expect(clientOutput.name).toBe(client.name);
        expect(clientOutput.email).toBe(client.email);
        expect(clientOutput.street).toBe(client.street);
        expect(clientOutput.number).toBe(client.number);
        expect(clientOutput.complement).toBe(client.complement);
        expect(clientOutput.city).toBe(client.city);
        expect(clientOutput.state).toBe(client.state);
        expect(clientOutput.zipCode).toBe(client.zipCode);
        expect(clientOutput.createdAt).toStrictEqual(client.createdAt);
        expect(clientOutput.updatedAt).toStrictEqual(client.updatedAt);
    });

});
