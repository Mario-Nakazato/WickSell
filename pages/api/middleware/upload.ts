import util from "util";
import multer from "multer";
import { getSession } from 'next-auth/react'
import { GridFsStorage } from "multer-gridfs-storage";
import Perfil from "../../../utils/perfil";

const url = process.env.MONGODB_URL!
const database = process.env.MONGODB_DATABASE!
const imgBucket = process.env.MONGODB_COLLECTION_IMG_BUCKET!
const perfil = new Perfil()

var storage = new GridFsStorage({
    url: url + '/' + database,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: async (req: any, file: any) => {
        const session: any = await getSession({ req })
        if (!session) return
        const match = ["image/png", "image/jpeg"];
        const currentName = file.originalname.split(' ').join('_')
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${currentName}`;
            return filename;
        }
        return {
            bucketName: imgBucket,
            filename: `${Date.now()}-${currentName}`,
            aliases: { email: session.user.email },
        };
    }
});

//var uploadFiles = multer({ storage: storage }).single("file");
var uploadFiles = multer({ storage }).array("file", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
export default uploadFilesMiddleware;
