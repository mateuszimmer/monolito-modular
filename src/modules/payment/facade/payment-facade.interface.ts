export interface InputPaymentFacadeDto {
    orderId: string;
    amount: number;
}

export interface OutputPaymentFacadeDto {
    transactionId: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export default interface PaymentFacadeInterface {
    process(input: InputPaymentFacadeDto): Promise<OutputPaymentFacadeDto>;
}