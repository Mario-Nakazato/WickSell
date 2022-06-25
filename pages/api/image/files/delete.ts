const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = process.env.MONGODB_URL!
const database = process.env.MONGODB_DATABASE!
const imgBucket = process.env.MONGODB_COLLECTION_IMG_BUCKET!

const mongoClient = new MongoClient(url);

export default async function deleteListFiles(req: any, res: any) {
    var baseUrl = req.headers.host + '/api/image/files/'
    if (req.headers.host.toString().includes('localhost')) {
        baseUrl = 'http://' + baseUrl
    } else {
        baseUrl = 'https://' + baseUrl
    }
    try {
        await mongoClient.connect();
        const databaseClient = mongoClient.db(database);
        const images = databaseClient.collection(imgBucket + ".files");
        const bucket = new GridFSBucket(databaseClient, {
            bucketName: imgBucket,
        });
        const cursor = images.find({});
        const length = await images.countDocuments()
        if (length === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }
        const files = await cursor.toArray()
        const filesInfoPromise = await files.map(async (file: any) => {
            return await Promise.resolve(await bucket.delete(file._id).then(() => {
                return ({ file: file.filename, status: 'Deleted' })
            }).catch((err: any) => {
                if (err) {
                    return ({ file: file.filename, status: err.message })
                } else {
                }
            }))
        })
        const filesInfo = await Promise.all(filesInfoPromise)
        return res.status(200).send(filesInfo);
    } catch (error: any) {
        return res.status(500).send({ message: error.message });
    }
};
