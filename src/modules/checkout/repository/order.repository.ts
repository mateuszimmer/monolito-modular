import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";
import ClientModel from "./client.model";
import ProductModel from "./product.model";
import OrderProductModel from "./order-product.model";
import Id from "../../@shared/domain/value-object/id.value-object";


export default class OrderRepository implements CheckoutGateway {

    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            clientId: order.client.id.id,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        });

        for (const product of order.products) {
            await OrderProductModel.create({
                orderId: order.id.id,
                productId: product.id.id,
            });
        }
    }

    async findOrder(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: [
                { model: ClientModel },
                { model: ProductModel }
            ]
        });

        if (!orderModel) {
            throw new Error("Order not found");
        }

        const client = new Client({
            id: new Id(orderModel.client.id),
            name: orderModel.client.name,
            email: orderModel.client.email,
            street: orderModel.client.street,
            number: orderModel.client.number,
            complement: orderModel.client.complement,
            city: orderModel.client.city,
            state: orderModel.client.state,
            zipCode: orderModel.client.zipCode,
        });

        const products = orderModel.products.map(p => new Product({
            id: new Id(p.id),
            name: p.name,
            description: p.description,
            salesPrice: p.salesPrice,
        }));

        return new Order({
            id: new Id(orderModel.id),
            client,
            products,
            status: orderModel.status,
            createdAt: orderModel.createdAt,
            updatedAt: orderModel.updatedAt
        });
    }

}