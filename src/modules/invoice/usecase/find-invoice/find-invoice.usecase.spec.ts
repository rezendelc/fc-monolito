import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from '../../domain/invoice-item.entity'
import Invoice from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const invoice = new Invoice({
  id: new Id("1"),
  name: "Lucian",
  document: "document",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888",
  ),
  items: [
    new InvoiceItem({
      id: new Id("2"),
      name: "Item 1",
      price: 5,
    }),
    new InvoiceItem({
      id: new Id("3"),
      name: "Item 2",
      price: 10,
    })
  ]
})

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find Invoice use case unit test", () => {

  it("should find an invoice", async () => {

    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address).toEqual(invoice.address)
    expect(result.createdAt).toEqual(invoice.createdAt)
    expect(result.total).toBe(15)

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("2");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(5);
    expect(result.items[1].id).toBe("3");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(10);
  })
})