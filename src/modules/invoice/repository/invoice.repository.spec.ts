import { Sequelize } from "sequelize-typescript";
import { InvoiceItemModel, InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItem from '../domain/invoice-item.entity';
import Id from '../../@shared/domain/value-object/id.value-object';
import Invoice from '../domain/invoice.entity';
import Address from '../../@shared/domain/value-object/address';

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceItem1 = new InvoiceItem({
      id: new Id("2"),
      name: "item1",
      price: 5
    })

    const invoiceItem2 = new InvoiceItem({
      id: new Id("3"),
      name: "item2",
      price: 10
    })

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document",
      address: new Address(
        "street",
        "number",
        "complement",
        "city",
        "state",
        "zipCode",
      ),
      items: [invoiceItem1, invoiceItem2],
    });

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoice)

    const dbInvoice = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [InvoiceItemModel]
    })

    expect(dbInvoice.id).toBe("1");
    expect(dbInvoice.name).toBe("Invoice 1");
    expect(dbInvoice.document).toBe("Document")
    expect(dbInvoice.street).toBe("street");
    expect(dbInvoice.number).toBe("number");
    expect(dbInvoice.complement).toBe("complement");
    expect(dbInvoice.city).toBe("city");
    expect(dbInvoice.state).toBe("state");
    expect(dbInvoice.zipCode).toBe("zipCode");
    expect(dbInvoice.total).toBe(15)

    expect(dbInvoice.items).toHaveLength(2);
    expect(dbInvoice.items[0].id).toBe("2");
    expect(dbInvoice.items[0].name).toBe("item1");
    expect(dbInvoice.items[0].price).toBe(5);
    expect(dbInvoice.items[1].id).toBe("3");
    expect(dbInvoice.items[1].name).toBe("item2");
    expect(dbInvoice.items[1].price).toBe(10);
  });

  it("should find one invoice by id", async () => {
    const invoiceItems = [
      {
        id: "2",
        name: "Item 1",
        price: 5,
        invoiceId: "1"
      },
      {
        id: "3",
        name: "Item 2",
        price: 10,
        invoiceId: "1"
      }
    ]

    const invoice = {
      id: "1",
      name: "Invoice 1",
      document: "Document",
      street: "street",
      number: "number",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
      total: invoiceItems.reduce((total, currentItem) => total + currentItem.price, 0),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await InvoiceModel.create(invoice)
    await InvoiceItemModel.bulkCreate(invoiceItems)

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id)

    expect(result.id.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("Document")
    expect(result.address.street).toBe("street");
    expect(result.address.number).toBe("number");
    expect(result.address.complement).toBe("complement");
    expect(result.address.city).toBe("city");
    expect(result.address.state).toBe("state");
    expect(result.address.zipCode).toBe("zipCode");
    expect(result.total).toBe(15)

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id.id).toBe("2");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(5);
    expect(result.items[1].id.id).toBe("3");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(10);
  });
});
