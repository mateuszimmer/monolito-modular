export interface InputFindClientUseCaseDTO {
    id: string;
}

export interface OutputFindClientUseCaseDTO {
    id: string;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
}