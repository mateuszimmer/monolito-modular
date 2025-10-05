export interface InputFindClientUseCaseDTO {
    id: string;
}

export interface OutputFindClientUseCaseDTO {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}