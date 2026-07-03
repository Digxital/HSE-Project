const Client = require("../model/client.model");
const Location = require("../model/location.model");
const { clientBelongsToTenant } = require("../utils/tenantScope");

// Create location under a client

exports.createLocation = async (req, res) => {
    const { clientId } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Location name is required" });
    }

    const clientAllowed = await clientBelongsToTenant(clientId, req.user.tenantId);
    if (!clientAllowed) {
        return res.status(404).json({ message: "Client not found" });
    }

    const location = await Location.create({
        clientId,
        name
    });

    res.status(201).json({
        message: "Location created successfully",
        location
    });
};
