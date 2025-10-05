export interface InputAddClientAdmFacade {
    id?: string;
    name: string;
    email: string;
    address: string;
}
export interface OutputAddClientAdmFacade {
    id: string;
}

export interface InputFindClientAdmFadade {
    id: string;
}

export interface OutputFindClientAdmFacade {
    id: string;
    name: string;
    email: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {
    add(input: InputAddClientAdmFacade): Promise<OutputAddClientAdmFacade>;
    find(input: InputFindClientAdmFadade): Promise<OutputFindClientAdmFacade>;
}