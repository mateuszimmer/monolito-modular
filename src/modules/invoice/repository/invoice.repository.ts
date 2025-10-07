import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/entity/invoice-item.entity";
import Invoice from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceGateway from "../gateway/invoice-gateway.interface";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {

    async find(id: string): Promise<Invoice> {
        const invoiceModel = await InvoiceModel.findOne({
            where: { id },
            include: [InvoiceItemModel]
        })

        return new Invoice({
            id: new Id(invoiceModel.id),
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: new Address({
                street: invoiceModel.street,
                number: invoiceModel.number,
                complement: invoiceModel.complement,
                city: invoiceModel.city,
                state: invoiceModel.state,
                zipCode: invoiceModel.zipCode,
            }),
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt,
            items: invoiceModel.items.map(i => new InvoiceItem({
                id: new Id(i.id),
                name: i.name,
                price: i.price,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            }))
        })
    }

    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });

        for (const item of invoice.items) {
            await InvoiceItemModel.create({
                id: item.id.id,
                name: item.name,
                price: item.price,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                invoiceId: invoice.id.id,
            });
        }
    }

}