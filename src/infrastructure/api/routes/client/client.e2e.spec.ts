import Request from 'supertest';
import { ClientModel as ClientModelAdm } from "../../../../modules/client-adm/repository/client.model";
import { app, migration, sequelize } from "../../express";

describe('client e2e tests', () => {

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

    it('Should create a client', async () => {
        const response = await Request(app)
            .post('/clients')
            .send({
                name: 'client name',
                document: '1144778899',
                email: 'test@mail.com',
                street: 'Street name',
                number: 12344,
                complement: 'complement',
                city: 'London',
                state: 'Alberta',
                zipCode: '11445522',
            });
        
        const clientModel = await ClientModelAdm.findOne({ where: { id : response.body.id } })
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(clientModel.name).toBe('client name');
        expect(clientModel.document).toBe('1144778899');
        expect(clientModel.email).toBe('test@mail.com');
        expect(clientModel.street).toBe('Street name');
        expect(clientModel.number).toBe('12344');
        expect(clientModel.complement).toBe('complement');
        expect(clientModel.city).toBe('London');
        expect(clientModel.state).toBe('Alberta');
        expect(clientModel.zipCode).toBe('11445522');
    })
})