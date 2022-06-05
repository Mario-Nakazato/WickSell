import { NextApiRequest, NextApiResponse } from "next";
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = process.env.MONGODB_URL!
const database = process.env.MONGODB_DATABASE!
const imgBucket = process.env.MONGODB_COLLECTION_IMG_BUCKET!

const mongoClient = new MongoClient(url);

export default async function Delete(request: NextApiRequest, response: NextApiResponse) {
    const name = request.query.name.toString()

    try {
        await mongoClient.connect();

        const databaseClient = mongoClient.db(database);
        const bucket = new GridFSBucket(databaseClient, {
            bucketName: imgBucket,
        });
        return new Promise(() => {
            bucket.find({ filename: name }).toArray((err: any, files: any) => {
                if (err) {
                    return response.status(500).send({ message: "Cannot delete the Image!" });
                }
                if (files.length === 0) {
                    return response.status(404).send({ message: "Cannot find the Image!" });
                }
                bucket.delete(files[0]._id, (err: any) => {
                    if (err) {
                        return response.status(500).send({ message: "Cannot delete the Image!" });
                    }
                    return response.status(200).send({ message: "Image deleted!" });
                })
            })
        })

    } catch (error: any) {
        return response.status(500).send({
            message: error.message,
        });
    }
};