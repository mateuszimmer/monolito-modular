import InvoiceFacadeInterface from "../facade/invoice-facade.interface";
import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-usecase/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-usecase/generate-invoice.usecase";

export default class InvoiceFacadeFactory {

    static create(): InvoiceFacadeInterface {
        const repo = new InvoiceRepository();
        const generateUseCase = new GenerateInvoiceUseCase(repo);
        const findUseCase = new FindInvoiceUseCase(repo);
        const facade = new InvoiceFacade({
            findUseCase, 
            generateUseCase,
        });
        return facade;
    }

}