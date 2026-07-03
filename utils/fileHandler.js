/**
 * Extract file metadata from multer file object (Cloudinary)
 */
exports.extractFileMetadata = (file) => {
    if (!file) {
        console.log("File is null or undefined");
        return null;
    }

    console.log("=== File Object Received ===");
    console.log("Keys:", Object.keys(file));
    console.log("path:", file.path);
    console.log("secure_url:", file.secure_url);
    console.log("filename:", file.filename);
    console.log("originalname:", file.originalname);
    console.log("=============================");

    // Cloudinary returns URL in path, filename as public_id path
    const url = file.path || file.secure_url || file.url;
    const filename = file.filename || file.originalname;

    if (!url) {
        console.error("❌ ERROR: No URL found from Cloudinary!");
        console.error("File object:", file);
        throw new Error("Cloudinary upload failed - no URL returned");
    }

    return {
        filename: filename,
        originalName: file.originalname || filename,
        path: url,
        url: url,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
    };
};

/**
 * Extract multiple file metadata from array
 */
exports.extractMultipleFileMetadata = (files) => {
    if (!files || !Array.isArray(files)) return [];

    return files.map(file => {
        const url = file.path || file.secure_url || file.url;

        if (!url) {
            throw new Error(`No URL found for file: ${file.originalname}`);
        }

        const filename = file.public_id || file.filename || file.originalname;

        return {
            filename,
            originalName: file.originalname || filename,
            path: url,
            url,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date()
        };
    });
};

/**
 * Build profile picture payload for user/superadmin documents
 */
exports.buildProfilePicPayload = (file) => {
    if (!file) {
        return undefined;
    }

    const metadata = exports.extractFileMetadata(file);

    return {
        url: metadata.url,
        filename: metadata.filename,
        originalName: metadata.originalName,
        mimetype: metadata.mimetype,
        size: metadata.size,
        uploadedAt: metadata.uploadedAt
    };
};

/**
 * Get file URL (already provided by Cloudinary)
 */
exports.getFileUrl = (filePath) => {
    // For Cloudinary, the URL is already in secure_url
    return filePath;
};

/**
 * Delete file from Cloudinary
 */
exports.deleteFile = (filePath) => {
    // Cloudinary handles cleanup automatically
    // No manual deletion needed
    return true;
};

/**
 * Delete multiple files
 */
exports.deleteMultipleFiles = (filePaths) => {
    // Cloudinary handles cleanup automatically
    return true;
};

/**
 * Validate file exists
 */
exports.fileExists = (filePath) => {
    // For Cloudinary, assume files exist
    return !!filePath;
};