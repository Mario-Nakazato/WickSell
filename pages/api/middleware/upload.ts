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
        const session = await getSession({ req })
        if (!session) return
        await perfil.setEmail(session?.user?.email!)
        const documentoPerfil = await perfil.findOne()
        const match = ["image/png", "image/jpeg"];
        const currentName = file.originalname.split(' ').join('_')
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-${currentName}`;
            return filename;
        }
        return {
            bucketName: imgBucket,
            filename: `${Date.now()}-${currentName}`,
            aliases: { _idPerfil: documentoPerfil?._id.toString() },
        };
    }
});

//var uploadFiles = multer({ storage: storage }).single("file");
var uploadFiles = multer({ storage }).array("file", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
export default uploadFilesMiddleware;
