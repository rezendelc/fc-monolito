import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"

type InvoiceItemProps = {
  id?: Id
  name: string
  price: number
  invoiceId: Id
}

export default class InvoiceItem implements AggregateRoot {

  private _id: Id
  private _name: string
  private _price: number
  private _invoiceId: Id

  constructor(props: InvoiceItemProps) {
    this._id = props.id
    this._name = props.name
    this._price = props.price
    this._invoiceId = props.invoiceId
  }

  get id(): Id {
    return this._id;
  }

  get name(): string {
    return this._name
  }

  get price(): number {
    return this._price
  }

  get invoiceId(): Id {
    return this._invoiceId
  }
}