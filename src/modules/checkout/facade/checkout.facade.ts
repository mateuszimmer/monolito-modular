import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import { InputPlaceOrderDTO, OutputPlaceOrderDTO } from "../usecase/place-order/place-order.dto";
import CheckoutFacadeInterface, { InputCheckoutFacadeInterface, OutputCheckoutFacadeInterface } from "./checkout-facade.interface";

export interface CheckoutFacadeConstructorProps {
    placeOrderUseCase: UseCaseInterface
}

export default class CheckoutFacade implements CheckoutFacadeInterface {

    private _placeOrderUsecase: UseCaseInterface;
    
    constructor(props: CheckoutFacadeConstructorProps) {
        this._placeOrderUsecase = props.placeOrderUseCase;
    };

    async placeOrder(input: InputCheckoutFacadeInterface): Promise<OutputCheckoutFacadeInterface> {
        const useCaseInput: InputPlaceOrderDTO = {
            clientId: input.clientId,
            products: input.products,
        };

        const output: OutputPlaceOrderDTO = await this._placeOrderUsecase.execute(useCaseInput);

        return {
            id: output.id,
            invoiceId: output.invoiceId,
            products: output.products,
            status: output.status,
            total: output.total,
        } as OutputCheckoutFacadeInterface;
    };

};