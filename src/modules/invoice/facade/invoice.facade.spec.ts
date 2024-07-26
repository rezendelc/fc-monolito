import { Sequelize } from 'sequelize-typescript'
import { InvoiceItemModel, InvoiceModel } from '../repository/invoice.model'
import InvoiceFacadeFactory from '../factory/invoice.facade.factory'

describe("Invoice Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: "Invoice",
      document: "document",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "2",
          name: "Item 1",
          price: 5
        },
        {
          id: "3",
          name: "Item 2",
          price: 10
        }
      ]
    }

    await facade.generate(input)

    const invoice = await InvoiceModel.findOne({ where: { name: "Invoice" }, include: [InvoiceItemModel] })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBeDefined()
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.street).toBe("Rua 123");
    expect(invoice.number).toBe("99");
    expect(invoice.complement).toBe("Casa Verde");
    expect(invoice.city).toBe("Criciúma");
    expect(invoice.state).toBe("SC");
    expect(invoice.zipCode).toBe("88888-888");

    expect(invoice.items).toHaveLength(2);
    expect(invoice.items[0].id).toBe("2");
    expect(invoice.items[0].name).toBe("Item 1");
    expect(invoice.items[0].price).toBe(5);
    expect(invoice.items[1].id).toBe("3");
    expect(invoice.items[1].name).toBe("Item 2");
    expect(invoice.items[1].price).toBe(10);
  })

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

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

    const dbInvoice = await facade.find({ id: "1" })

    expect(dbInvoice).toBeDefined()
    expect(dbInvoice.id).toBeDefined()
    expect(dbInvoice.name).toBe("Invoice 1")
    expect(dbInvoice.document).toBe("Document")
    expect(dbInvoice.address.street).toBe("street");
    expect(dbInvoice.address.number).toBe("number");
    expect(dbInvoice.address.complement).toBe("complement");
    expect(dbInvoice.address.city).toBe("city");
    expect(dbInvoice.address.state).toBe("state");
    expect(dbInvoice.address.zipCode).toBe("zipCode");
    expect(dbInvoice.total).toBe(15)

    expect(dbInvoice.items).toHaveLength(2);
    expect(dbInvoice.items[0].id).toBe("2");
    expect(dbInvoice.items[0].name).toBe("Item 1");
    expect(dbInvoice.items[0].price).toBe(5);
    expect(dbInvoice.items[1].id).toBe("3");
    expect(dbInvoice.items[1].name).toBe("Item 2");
    expect(dbInvoice.items[1].price).toBe(10);
  })
})