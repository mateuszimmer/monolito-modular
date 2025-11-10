export interface InputCheckoutFacadeInterface {
    clientId: string;
    products: {
        productId: string;
    } [];
}

export interface OutputCheckoutFacadeInterface {
    id: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        productId: string;
    } [];
}

export default interface CheckoutFacadeInterface {
    placeOrder(input: InputCheckoutFacadeInterface): Promise<OutputCheckoutFacadeInterface>;
}