import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm-facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice-facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/product-adm-facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/store-catalog-facade.factory";
import CheckoutFacadeInterface from "../facade/checkout-facade.interface";
import CheckoutFacade from "../facade/checkout.facade";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";


export default class CheckoutFacadeFactory {

    static create(): CheckoutFacadeInterface {
        const repository = new OrderRepository();
        const catalogFacade = StoreCatalogFacadeFactory.create();
        const clientFacade = ClientAdmFacadeFactory.create();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const paymentFacade = PaymentFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();

        const placeOrderUseCase = new PlaceOrderUseCase({
            repository,
            catalogFacade,
            clientFacade,
            invoiceFacade,
            paymentFacade,
            productFacade,
        })

        const factory = new CheckoutFacade({
            placeOrderUseCase
        })

        return factory;
    }

} 