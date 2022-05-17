const dbConfig = {
    url: "mongodb+srv://MdbAdmin:rootroot@rq.dd17a.mongodb.net/",
    database: "images",
    imgBucket: "photos",
}

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.url;

const baseUrl = "http://localhost:3000/api/image/files/";

const mongoClient = new MongoClient(url);

const getListFiles = async (req: any, res: any) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const images = database.collection(dbConfig.imgBucket + ".files");

        const cursor = images.find({});

        if ((await cursor.count()) === 0) {
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