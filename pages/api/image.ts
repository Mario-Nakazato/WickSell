import multer from 'multer';
import path from 'path';

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;


const util = require("util");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

const url = ''//dbConfig.url;

//const baseUrl = "http://localhost:8080/files/";

const mongoClient = new MongoClient(url);

var storage = new GridFsStorage({
    url: dbConfig.url + dbConfig.database,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req: any, file: any) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: dbConfig.imgBucket,
            filename: `${Date.now()}-${file.originalname}`
        };
    }
});
//  var uploadFiles = multer({ storage: storage }).array("file", 10);
var uploadFilesMid = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFilesMid);





const uploadFiles = async (req: any, res: any) => {
    try {
        await uploadFilesMiddleware(req, res);//middleware
        console.log(req.files);

        if (req.files.length <= 0) {
            return res
                .status(400)
                .send({ message: "You must select at least 1 file." });
        }

        return res.status(200).send({
            message: "Files have been uploaded.",
        });

    } catch (error: any) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload.",
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`,
        });
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            ;
            let tempName = file.originalname.split('.')
            const name = tempName[tempName.length - 2].concat('_' + Date.now() + path.extname(file.originalname))
            cb(null, name) // return
        }
    })
});

export default async function apiImage(req: any, res: any) {
    // upload.single('image')(req, res, err => {
    //     if (err)
    //         res.status(500).send({ error: err });
    //     else {
    //         res.status(200).send({ error: err, content: req.file });
    //     }
    // });
    //console.log(req);
    if (req.method === 'POST') {
        await uploadFiles(req, res)
        const body = JSON.parse(req.body);
        res.status(200).json(body)
    } else {
        res.status(404)
    }
}

export const config = {
    api: {
        bodyParser: true, // Disallow body parsing, consume as stream
    },
};