import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import PaymentFacadeInterface, { InputPaymentFacadeDto, OutputPaymentFacadeDto } from "./payment-facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
    
    constructor(
        private processUseCase: UseCaseInterface
    ) {}

    process(input: InputPaymentFacadeDto): Promise<OutputPaymentFacadeDto> {
        return this.processUseCase.execute(input);
    }
}