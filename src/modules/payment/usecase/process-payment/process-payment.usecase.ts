import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import { InputProcessPaymentUseCaseDTO, OutputProcessPaymentUseCaseDTO } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {

    constructor(
        private repo: PaymentGateway,
    ) {};

    async execute(input: InputProcessPaymentUseCaseDTO): Promise<OutputProcessPaymentUseCaseDTO> {
        const transaction = new Transaction({
            amount: input.amount,
            orderId: input.orderId,
        })

        transaction.process();
        
        const persistedTransaction = await this.repo.save(transaction);

        return {
            transactionId: persistedTransaction.id.id,
            orderId: persistedTransaction.orderId,
            amount: persistedTransaction.amount,
            status: persistedTransaction.status,
            createdAt: persistedTransaction.createdAt,
            updatedAt: persistedTransaction.updatedAt,
        } as OutputProcessPaymentUseCaseDTO;
    }
}