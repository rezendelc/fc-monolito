import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from '../domain/invoice-item.entity';
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel, InvoiceItemModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

  async generate(entity: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: entity.id.id,
      name: entity.name,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipCode: entity.address.zipCode,
      total: entity.items.reduce((total, currentItem) => total + currentItem.price, 0),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    })

    const items = entity.items.map(item => ({
      id: item.id.id,
      name: item.name,
      price: item.price,
      invoiceId: entity.id.id,
    }));

    await InvoiceItemModel.bulkCreate(items)
  }

  async find(id: string): Promise<Invoice> {

    const invoice = await InvoiceModel.findOne({ where: { id }, include: [InvoiceItemModel] })

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode,
      ),
      items: invoice.items.map(item => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })
  }
}