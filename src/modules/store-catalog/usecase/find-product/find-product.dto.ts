export interface InputFindProductDTO {
    productId: string;
}

export interface OutputFindProductDTO {
    productId: string;
    name: string;
    description: string;
    salesPrice: number
}