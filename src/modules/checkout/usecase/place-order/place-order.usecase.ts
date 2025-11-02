import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm-facade.interface";
import InvoiceFacade from "../../../invoice/facade/invoice.facade";
import PaymentFacade from "../../../payment/facade/payment.facade";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog-facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product, { ProductConstructorProps } from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { InputPlaceOrderDTO, OutputPlaceOrderDTO } from "./place-order.dto";

export type PlaceOrderUseCaseConstructorProps = {
    clientFacade: ClientAdmFacadeInterface;
    productFacade: ProductAdmFacadeInterface;
    catalogFacade: StoreCatalogFacadeInterface;
    repository: CheckoutGateway;
    invoiceFacade: InvoiceFacade;
    paymentFacade: PaymentFacade;
}

export default class PlaceOrderUseCase implements UseCaseInterface {
    
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _repository: CheckoutGateway;
    private _invoiceFacade: InvoiceFacade;
    private _paymentFacade: PaymentFacade;

    constructor(props: PlaceOrderUseCaseConstructorProps) {
        this._clientFacade = props.clientFacade;
        this._productFacade = props.productFacade;
        this._catalogFacade = props.catalogFacade;
        this._repository = props.repository;
        this._invoiceFacade = props.invoiceFacade;
        this._paymentFacade = props.paymentFacade;
    }
    
    async execute(input: InputPlaceOrderDTO): Promise<OutputPlaceOrderDTO> {
        // Buscar o cliente. Caso não encontre, retorna "client not found";
        const client = await this._clientFacade.find({ id: input.clientId });
        if (!client)
            throw new Error('Client Not Found')

        // Validar produtos -> função à parte
        await this.validateProducts(input);

        // Recuperar os produtos.
        const products = await Promise.all(
            input.products.map((p) => this.getProduct(p.productId))
        );


        // Criar o objeto do Client
        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        })

        // Criar o objeto da Order (client, products)
        const order = new Order({
            client: myClient,
            products,
        });

        // Processar pagamento
        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total,
        })

        const invoice = payment.status === 'approved'
            ? await this._invoiceFacade.generate({
                name: client.name,
                document: client.document,
                street: client.street,
                number: client.number,
                complement: client.complement,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode,
                items: products.map(p => ({
                    id: p.id.id,
                    name: p.name,
                    price: p.salesPrice,
                })),
            })
            : null;

        payment.status === 'approved' && order.approve();
        this._repository.addOrder(order);

        // Caso pagamento seja aprovado -> gerar invoice
        // Mudar o status da order para approved
        // Retornar DTO


        return {
            id: order.id.id,
            invoiceId: invoice ? invoice.id : null,
            products: order.products.map(product => ({
                productId: product.id.id,
            })),
            status: order.status,
            total: order.total,
        };
    };
    
    private async validateProducts(input: InputPlaceOrderDTO): Promise<void> {
        if(input.products.length == 0)
            throw new Error('No products selected');
        
        for (const p of input.products) {
            const product = await this._productFacade.checkStock({ productId: p.productId });
            if (product.stock <= 0)
                throw new Error(`Product ${p.productId} is not available in stock`);
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const catalogOutput = await this._catalogFacade.find({ productId });
        
        if(!catalogOutput)
            throw new Error('Product not found')

        const productProps: ProductConstructorProps = {
            id: new Id(catalogOutput.productId),
            description: catalogOutput.description,
            name: catalogOutput.name,
            salesPrice: catalogOutput.salesPrice,
        }

        return new Product(productProps);
    }
}