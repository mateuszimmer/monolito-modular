export interface InputAddProductFacadeDTO {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    salesPrice: number;
    stock: number;
}

export interface InputCheckStockFacadeDTO {
    productId: string;
}

export interface OutputCheckStockFacadeDTO {
    productId: string;
    stock: number;
}

export default interface ProductAdmFacadeInterface {
    addProduct(input: InputAddProductFacadeDTO): Promise<InputCheckStockFacadeDTO>;
    checkStock(input: InputCheckStockFacadeDTO): Promise<OutputCheckStockFacadeDTO>;
}