export interface InputAddClientUseCase {
    id?: string;
    name: string;
    email: string;
    address: string;
}

export interface OutputAddClientUseCase {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}