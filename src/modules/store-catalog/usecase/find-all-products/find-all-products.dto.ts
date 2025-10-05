export type OutputProduct = {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
};

export interface OutputFindAllProductsDTO {
    products: OutputProduct[];
}