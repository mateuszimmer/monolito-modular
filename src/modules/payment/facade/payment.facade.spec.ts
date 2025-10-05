import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import PaymentFacade from "./payment.facade";
import PaymentFacadeFactory from "../factory/payment.factory";

describe('PaymentFacade tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: ({ force: true })
        });
        sequelize.addModels([ TransactionModel ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        sequelize.close();
    });

    it('should process a payment', async () => {
        const facade = PaymentFacadeFactory.create();

        const response = await facade.process({
            orderId: '3',
            amount: 120,
        })

        expect(response.orderId).toBe('3');
        expect(response.amount).toBe(120);
        expect(response.status).toBe('approved');
        expect(response.transactionId).toBeDefined();
    });
});