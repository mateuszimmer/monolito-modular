import Id from "../../@shared/domain/value-object/id.value-object";
import Client, { ClientConstructorProps } from "../domain/client.entity";
import ClienGateway from "../gateway/client.gateway";
import { ClientModel } from "./client.model";

export default class ClientRepository implements ClienGateway {

    async add(client: Client): Promise<void> {
        await ClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        });
    }
    async find(id: string): Promise<Client> {
        const clientModel = await ClientModel.findOne({ where: { id } })
        const clientProps: ClientConstructorProps = {
            id: new Id (clientModel.id),
            name: clientModel.name,
            email: clientModel.email,
            document: clientModel.document,
            street: clientModel.street,
            number: clientModel.number,
            complement: clientModel.complement,
            city: clientModel.city,
            state: clientModel.state,
            zipCode: clientModel.zipCode,
            createdAt: clientModel.createdAt,
            updatedAt: clientModel.updatedAt,
        }
        return new Client(clientProps);
    }
}