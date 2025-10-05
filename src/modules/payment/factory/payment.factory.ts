import PaymentFacadeInterface from "../facade/payment-facade.interface";
import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";

export default class PaymentFacadeFactory {

    static create(): PaymentFacadeInterface {
        const repo = new TransactionRepository();
        const useCase = new ProcessPaymentUseCase(repo);
        const facade = new PaymentFacade(useCase);
        return facade;
    }

}