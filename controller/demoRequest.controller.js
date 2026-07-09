const DemoRequest = require("../model/demoRequest.model");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "company",
    "jobTitle",
    "country"
];

exports.submitDemoRequest = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            company,
            jobTitle,
            country,
            message
        } = req.body;

        const errors = [];

        for (const field of REQUIRED_FIELDS) {
            const value = req.body[field];
            if (value === undefined || value === null || String(value).trim() === "") {
                errors.push(`${field} is required`);
            }
        }

        if (email && String(email).trim() && !EMAIL_PATTERN.test(String(email).trim())) {
            errors.push("email must be a valid email address");
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors.join(", "),
                data: {}
            });
        }

        const demoRequest = await DemoRequest.create({
            firstName: String(firstName).trim(),
            lastName: String(lastName).trim(),
            email: String(email).trim().toLowerCase(),
            phone: String(phone).trim(),
            company: String(company).trim(),
            jobTitle: String(jobTitle).trim(),
            country: String(country).trim(),
            message: message !== undefined ? String(message).trim() : "",
            requestedAt: new Date()
        });

        return res.status(201).json({
            success: true,
            message: "Demo request submitted successfully",
            data: demoRequest
        });
    } catch (error) {
        console.error("Error submitting demo request:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(", "),
                data: {}
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to submit demo request",
            data: {}
        });
    }
};

exports.getDemoRequests = async (req, res) => {
    try {
        const { page = 1, limit = 50, search, country } = req.query;

        const filter = {};

        if (country) {
            filter.country = { $regex: String(country).trim(), $options: "i" };
        }

        if (search) {
            const term = String(search).trim();
            filter.$or = [
                { firstName: { $regex: term, $options: "i" } },
                { lastName: { $regex: term, $options: "i" } },
                { email: { $regex: term, $options: "i" } },
                { company: { $regex: term, $options: "i" } }
            ];
        }

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
        const skip = (pageNum - 1) * limitNum;

        const [total, demoRequests] = await Promise.all([
            DemoRequest.countDocuments(filter),
            DemoRequest.find(filter)
                .sort({ requestedAt: -1 })
                .skip(skip)
                .limit(limitNum)
        ]);

        return res.json({
            success: true,
            message: "Demo requests fetched successfully",
            data: {
                demoRequests,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(total / limitNum) || 1
                }
            }
        });
    } catch (error) {
        console.error("Error fetching demo requests:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch demo requests",
            data: {}
        });
    }
};

exports.getDemoRequestById = async (req, res) => {
    try {
        const demoRequest = await DemoRequest.findById(req.params.id);

        if (!demoRequest) {
            return res.status(404).json({
                success: false,
                message: "Demo request not found",
                data: {}
            });
        }

        return res.json({
            success: true,
            message: "Demo request fetched successfully",
            data: demoRequest
        });
    } catch (error) {
        console.error("Error fetching demo request:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch demo request",
            data: {}
        });
    }
};
