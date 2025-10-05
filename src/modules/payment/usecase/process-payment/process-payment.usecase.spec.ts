import Id from "../../../@shared/domain/value-object/id.value-object"
import Transaction from "../../domain/transaction"
import PaymentGateway from "../../gateway/payment.gateway"
import { InputProcessPaymentUseCaseDTO } from "./process-payment.dto"
import ProcessPaymentUseCase from "./process-payment.usecase"

const MockRepository = (): jest.MockedObject<PaymentGateway> => ({
    save: jest.fn().mockImplementation((input) => {
        return Promise.resolve(input);
    }),
})

describe('ProcessPaymentUseCase unit tests', () => {

    it('should return a transaction', async () => {
        const repo = MockRepository();
        const useCase = new ProcessPaymentUseCase(repo);
        const input: InputProcessPaymentUseCaseDTO = {
            orderId: '10',
            amount: 100,
        };
        const saveSpy = jest.spyOn(repo, 'save');
        const result = await useCase.execute(input);

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.transactionId).toBeDefined;
        expect(result.orderId).toBe(input.orderId);
        expect(result.amount).toBe(input.amount);
        expect(result.status).toBe('approved');
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    });

    it('should deny transaction', async () => {
        const repo = MockRepository();
        const useCase = new ProcessPaymentUseCase(repo);
        const input: InputProcessPaymentUseCaseDTO = {
            orderId: '5',
            amount: 90,
        };
        const saveSpy = jest.spyOn(repo, 'save');
        const result = await useCase.execute(input);

        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.transactionId).toBeDefined;
        expect(result.orderId).toBe(input.orderId);
        expect(result.amount).toBe(input.amount);
        expect(result.status).toBe('declined');
        expect(result.createdAt).toBeDefined();
        expect(result.updatedAt).toBeDefined();
    })
});