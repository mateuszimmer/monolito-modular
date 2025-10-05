export interface InputProcessPaymentUseCaseDTO {
    orderId: string;
    amount: number;
}

export interface OutputProcessPaymentUseCaseDTO {
    transactionId: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}