import { NextApiRequest, NextApiResponse } from "next";
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = process.env.MONGODB_URL!
const database = process.env.MONGODB_DATABASE!
const imgBucket = process.env.MONGODB_IMG_BUCKET!

const mongoClient = new MongoClient(url);

export default async function download(request: NextApiRequest, response: NextApiResponse) {
    const name = request.query.name.toString()

    try {
        await mongoClient.connect();

        const databaseClient = mongoClient.db(database);
        const bucket = new GridFSBucket(databaseClient, {
            bucketName: imgBucket,
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
