const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
    region: process.env.SPACE_REGION,
    credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY,
        secretAccessKey: process.env.SPACES_SECRET_KEY,
    },
    endpoint: process.env.SPACE_ENDPOINT,
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.SPACE_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});

module.exports = upload;