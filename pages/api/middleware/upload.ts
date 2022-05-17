import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
const dbConfig = {
    url: "mongodb+srv://MdbAdmin:rootroot@rq.dd17a.mongodb.net/",
    database: "images",
    imgBucket: "photos",
}

var storage = new GridFsStorage({
    url: dbConfig.url + dbConfig.database,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req: any, file: any) => {
        const match = ["image/png", "image/jpeg"];
        console.log('--> Middleware')
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

//var uploadFiles = multer({ storage: storage }).single("file");
var uploadFiles = multer({ storage }).array("file", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
export default uploadFilesMiddleware;
