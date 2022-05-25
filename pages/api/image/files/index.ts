const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = process.env.MONGODB_URL!
const database = process.env.MONGODB_DATABASE!
const imgBucket = process.env.MONGODB_IMG_BUCKET!

const mongoClient = new MongoClient(url);

const getListFiles = async (req: any, res: any) => {
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

        const cursor = images.find({});

        if ((await images.countDocuments()) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        let fileInfos: any = [];
        await cursor.forEach((doc: any) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
            });
        });

        return res.status(200).send(fileInfos);
    } catch (error: any) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
export default getListFiles