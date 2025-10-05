import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction";
import TransactionRepository from "./transaction.repository";

describe('TransactionRepository tests', () => {

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
        await sequelize.close();
    });

    it('should save a transaction', async () => {
        const transaction = new Transaction({
            orderId: '15',
            amount: 200,
        });

        const repo = new TransactionRepository();

        await repo.save(transaction);

        const persistedTransaction = await TransactionModel.findOne({ where: { id: transaction.id.id }});

        expect(persistedTransaction.id).toBe(transaction.id.id);
        expect(persistedTransaction.orderId).toBe(transaction.orderId);
        expect(persistedTransaction.status).toBe(transaction.status);
        expect(persistedTransaction.amount).toBe(transaction.amount);
        expect(persistedTransaction.createdAt).toStrictEqual(transaction.createdAt);
        expect(persistedTransaction.updatedAt.getTime()).toBeGreaterThan(transaction.updatedAt.getTime());

    })

});