import { DatabaseConnector } from '@daos/DatabaseConnector';
import { Order } from '@entities/Order';
import { FilterQuery } from 'mongodb';

export class OrderDao {
  private _connector: DatabaseConnector<Order>;

  constructor() {
    this._connector = new DatabaseConnector('orders');
  }

  public async add$(order: Order): Promise<Order> {
    return await this._connector.add$(order);
  }

  public async update$(
    filters: FilterQuery<Order>,
    order: Partial<Order>
  ): Promise<Order> {
    return await this._connector.updateOne$(filters, order);
  }

  public async replace$(
    filters: FilterQuery<Order>,
    order: Order
  ): Promise<Order> {
    return await this._connector.replace$(filters, order);
  }
}
