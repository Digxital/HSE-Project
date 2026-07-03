const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Organization logo storage configuration for Cloudinary
const organizationLogoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "aegix/organization-logos",
        resource_type: "image",
        allowed_formats: ["jpeg", "png", "webp"]
    }
});

// File type validators
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];
const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

// Image storage configuration for Cloudinary
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "aegix/images",
        resource_type: "auto",
        allowed_formats: ["jpeg", "png", "webp"]
    }
});

// Document storage configuration for Cloudinary
const documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "aegix/documents",
        resource_type: "auto",
        allowed_formats: ["pdf"]
    }
});

// General storage (images + documents)
const generalStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        let folder = "aegix/documents";
        let allowed_formats = ["pdf"];
        
        if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            folder = "aegix/images";
            allowed_formats = ["jpeg", "png", "webp"];
        }
        
        return {
            folder: folder,
            resource_type: "auto",
            allowed_formats: allowed_formats
        };
    }
});

// File filter functions
const imageFilter = (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
    }
};

const documentFilter = (req, file, cb) => {
    if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF documents are allowed"), false);
    }
};

const generalFilter = (req, file, cb) => {
    if (ALL_ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images (JPEG, PNG, WebP) and PDFs are allowed"), false);
    }
};

// Create multer instances
const uploadImages = multer({ 
    storage: imageStorage, 
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB for images
});

const uploadDocuments = multer({ 
    storage: documentStorage, 
    fileFilter: documentFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB for documents
});

const uploadGeneral = multer({ 
    storage: generalStorage, 
    fileFilter: generalFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB general limit
});

const uploadOrganizationLogo = multer({
    storage: organizationLogoStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const profilePicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "aegix/profile-pictures",
        resource_type: "image",
        allowed_formats: ["jpeg", "png", "webp"]
    }
});

const uploadProfilePic = multer({
    storage: profilePicStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
    uploadImages,
    uploadDocuments,
    uploadGeneral,
    uploadOrganizationLogo,
    uploadProfilePic
}; 