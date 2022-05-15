import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
            ;
            let tempName = file.originalname.split('.')
            const name = tempName[tempName.length - 2].concat('_' + Date.now() + path.extname(file.originalname))

            cb(null, name)
        }

    })// + '_' + Date.now() + path.extname(file.originalname)),
});
export default async function apiImage(req: any, res: any) {
    upload.single('image')(req, res, err => {
        if (err)
            res.status(500).send({ error: err });
        else {
            res.status(200).send({ error: err, content: req.file });
        }
    });
}
export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};