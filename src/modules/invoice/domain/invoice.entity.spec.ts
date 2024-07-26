import Address from '../../@shared/domain/value-object/address'
import Id from '../../@shared/domain/value-object/id.value-object'
import InvoiceItem from './invoice-item.entity'
import Invoice from './invoice.entity'

describe("Methods of invoice entity unit test", () => {
  it("should sum all invoice items price", () => {
    const invoiceItem1 = new InvoiceItem({
      name: "Item1",
      price: 7,
    })

    const invoiceItem2 = new InvoiceItem({
      name: "Item2",
      price: 9,
    })

    const invoice = new Invoice({
      id: new Id("1"),
      name: "invoice",
      document: "document",
      address: new Address(
        "street",
        "number",
        "complement",
        "city",
        "state",
        "zipCode",
      ),
      items: [invoiceItem1, invoiceItem2]
    })

    expect(invoice.total).toBe(16)
  })
})