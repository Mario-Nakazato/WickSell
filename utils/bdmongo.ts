import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL!, { serverApi: ServerApiVersion.v1 })

function removeUndefined(obj: any = {}) {
    return Object.keys(obj).reduce((acc: any, key: any) => {
        const _acc = acc;
        if (obj[key] !== undefined) _acc[key] = obj[key];
        return _acc;
    }, {})
}

export default class bdMongo {
    private db: Db;

    constructor(db: string) {
        this.db = client.db(db)
    }

    async insertOne(collection: string, obj: {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).insertOne(obj);
            return result;
        } finally {
            await client.close();
        }
    }

    async insertMany(collection: string, array: [], ordered = true) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).insertMany(array, { ordered: ordered });
            return result;
        } finally {
            await client.close();
        }
    }

    async findOne(collection: string, query = {}, projection = {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).findOne(removeUndefined(query), projection);
            return result
        } finally {
            await client.close();
        }
    }

    async findAll(collection: string, query = {}, projection = {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).find(removeUndefined(query), projection).toArray()
            return result
        } finally {
            await client.close();
        }
    }

    async updateOne(collection: string, query = {}, update: {}, options = {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).updateOne(removeUndefined(query), update, options)
            return result
        } finally {
            await client.close();
        }
    }

    async updateMany(collection: string, query = {}, update: {}, options = {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).updateMany(removeUndefined(query), update, options)
            return result
        } finally {
            await client.close();
        }
    }

    async replaceOne(collection: string, query = {}, replacement: {}, options = {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).replaceOne(removeUndefined(query), replacement, options)
            return result
        } finally {
            await client.close();
        }
    }

    async deleteOne(collection: string, query = {}, options = {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).deleteOne(removeUndefined(query), options)
            return result
        } finally {
            await client.close();
        }
    }

    async deleteMany(collection: string, query = {}, options = {}) {
        try {
            await client.connect()
            const result = await this.db.collection(collection).deleteMany(removeUndefined(query), options)
            return result
        } finally {
            await client.close();
        }
    }
}