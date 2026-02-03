const Client = require("../model/client.model");

//  Create a client (company)

exports.createClient = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Client name is required" });
    }

    const client = await Client.create({
        name,
        description
    });

    res.status(201).json({
        message: "Client created successfully",
        client
    });
};

//  Get clients (for dropdown)

exports.getClients = async (req, res) => {
    const clients = await Client.find().select("_id name");

    res.json(clients);
};
