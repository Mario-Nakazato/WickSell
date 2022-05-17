import { NextApiRequest, NextApiResponse } from "next";

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



export default async function download(request: NextApiRequest, response: NextApiResponse) {
    const name = request.query.name.toString()

    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(name);

        downloadStream.on("data", function (data: any) {
            return response.status(200).write(data);
        });

        downloadStream.on("error", function (err: any) {
            return response.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return response.end();
        });
    } catch (error: any) {
        return response.status(500).send({
            message: error.message,
        });
    }
};
