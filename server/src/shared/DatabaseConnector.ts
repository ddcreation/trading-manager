import { DbEntity } from '@entities/DbEntity';
import { Collection, FilterQuery, MongoClient } from 'mongodb';

export class DatabaseConnector<T extends DbEntity> {
  private _collection: string;
  private _dbName: string;
  private _dbUri: string;

  constructor(collection: string) {
    this._collection = collection;
    this._dbName = process.env.MONGO_INITDB_DATABASE as string;
    this._dbUri = `mongodb://${encodeURIComponent(
      process.env.MONGO_INITDB_USERNAME as string
    )}:${encodeURIComponent(process.env.MONGO_INITDB_PASSWORD as string)}@${
      process.env.MONGO_HOST
    }:${process.env.MONGO_PORT}/?authMechanism=SCRAM-SHA-1&authSource=${
      process.env.MONGO_INITDB_DATABASE
    }`;
  }

  public async add$(entity: T): Promise<T> {
    const { client, collection } = await this._connect$();

    const insert = await collection.insertOne(entity as any);
    await client.close();

    return (insert as any) as T;
  }

  public async find$(params: FilterQuery<T>): Promise<T[]> {
    const { client, collection } = await this._connect$();

    const entities = await collection.find(params).toArray();
    await client.close();

    return entities;
  }

  public async getById$(id: string): Promise<T> {
    const { client, collection } = await this._connect$();

    const byId = await collection.findOne({
      _id: id as any,
    });
    await client.close();

    return byId as T;
  }

  public async getAll$(): Promise<T[]> {
    const { client, collection } = await this._connect$();

    const entities = await collection.find().toArray();
    await client.close();

    return entities;
  }

  public async update$(id: string, entity: T): Promise<T> {
    const { client, collection } = await this._connect$();

    const update = await collection.updateOne({ _id: id as any }, entity);
    await client.close();

    return (update as any) as T;
  }

  private async _connect$(): Promise<{
    client: MongoClient;
    collection: Collection<T>;
  }> {
    const client = await new MongoClient(this._dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).connect();

    const collection = client.db(this._dbName).collection<T>(this._collection);
    return { client, collection };
  }
}
