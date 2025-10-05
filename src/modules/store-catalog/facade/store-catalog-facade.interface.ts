export interface InputFindStoreCatalogFacadeDTO {
    productId: string;
}

export interface OutputFindStoreCatalogFacadeDTO {
    productId: string;
    name: string;
    description: string;
    salesPrice: number;
}

export type ProductOutputFIndAllStoreCatalogFacade = {
    productId: string;
    name: string;
    description: string;
    salesPrice: number;
}

export interface OutputFindAllStoreCatalogFacadeDTO {
    products: ProductOutputFIndAllStoreCatalogFacade[];
}

export default interface StoreCatalogFacadeInterface {
    find(input: InputFindStoreCatalogFacadeDTO): Promise<OutputFindStoreCatalogFacadeDTO>;
    findAll(): Promise<OutputFindAllStoreCatalogFacadeDTO>;
}