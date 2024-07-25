import Transaction from 'sequelize/types/transaction';
import Invoice from '../domain/invoice.entity';


export default interface InvoiceGateway {
  generate(invoice: Invoice, transaction: Transaction): Promise<void>;
  find(id: string): Promise<Invoice>;
}
