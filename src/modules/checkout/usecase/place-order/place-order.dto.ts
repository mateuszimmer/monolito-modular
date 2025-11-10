export interface InputPlaceOrderDTO {
    clientId: string;
    products: {
        productId: string;
    } [];
}

export interface OutputPlaceOrderDTO {
    id: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
    } [];
}