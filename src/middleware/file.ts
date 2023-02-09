const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/svg+xml': 'svg'
}

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const isValid: string = (MIME_TYPE_MAP as any)[file.mimetype];
    let error = new Error("Mauvais type");
    if (isValid) {
      error = null;
    }

    cb(error, "images");
  },

  filename: (req: any, file: any, cb: any) => {
    let name = file.originalname.toLocaleLowerCase().split(' ').join('_');
    name = name.split('.')[0];

    const ext: string = (MIME_TYPE_MAP as any)[file.mimetype];

    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

export default multer({ storage: storage }).single("image");