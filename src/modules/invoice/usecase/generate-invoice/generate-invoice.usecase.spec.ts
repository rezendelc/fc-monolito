import Address from "../../../@shared/domain/value-object/address"
import GenerateInvoiceUseCase from './generate-invoice.usecase'


const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  }
}

describe("Add Invoice use case unit test", () => {

  it("should add a invoice", async () => {

    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
      name: "Lucian",
      email: "lucian@123.com",
      document: "1234-5678",
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

    const result = await usecase.execute(input)

    expect(repository.generate).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.street).toEqual(input.street)
    expect(result.number).toEqual(input.number)
    expect(result.complement).toEqual(input.complement)
    expect(result.city).toEqual(input.city)
    expect(result.state).toEqual(input.state)
    expect(result.zipCode).toEqual(input.zipCode)

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("2");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(5);
    expect(result.items[1].id).toBe("3");
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(10);
  })
})