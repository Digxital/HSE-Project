const Client = require("../model/client.model");

const buildLocationFromClient = (locationId, client) => {
    if (!locationId || String(locationId).trim() === "") {
        return null;
    }

    if (!client) {
        return {
            id: String(locationId),
            name: null,
            description: null
        };
    }

    return {
        id: client._id.toString(),
        name: client.name,
        description: client.description || null
    };
};

const buildUserLocationResponse = async (locationId) => {
    if (!locationId || String(locationId).trim() === "") {
        return null;
    }

    const client = await Client.findById(locationId).select("_id name description");
    return buildLocationFromClient(locationId, client);
};

const enrichUserWithLocation = (user, clientMap = new Map()) => {
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.passwordHash;

    const locationId = userObj.location || null;
    const client = locationId ? clientMap.get(String(locationId)) : null;
    const { location: _storedLocation, ...userWithoutLocation } = userObj;

    return {
        ...userWithoutLocation,
        locationId,
        location: buildLocationFromClient(locationId, client)
    };
};

const formatUsersWithLocation = async (users) => {
    const locationIds = [
        ...new Set(
            users
                .map((user) => user.location)
                .filter((locationId) => locationId && String(locationId).trim() !== "")
                .map((locationId) => String(locationId))
        )
    ];

    const clients = locationIds.length
        ? await Client.find({ _id: { $in: locationIds } }).select("_id name description")
        : [];

    const clientMap = new Map(clients.map((client) => [client._id.toString(), client]));

    return users.map((user) => enrichUserWithLocation(user, clientMap));
};

const formatUserWithLocation = async (user) => {
    const userObj = user.toObject ? user.toObject() : user;
    const location = await buildUserLocationResponse(userObj.location);

    return {
        id: userObj._id,
        email: userObj.email,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        fullName: `${userObj.firstName} ${userObj.lastName}`,
        role: userObj.role,
        status: userObj.status,
        tenantId: userObj.tenantId,
        locationId: userObj.location || null,
        location,
        profilePic: userObj.profilePic || null,
        hasDevices: Array.isArray(userObj.fcmTokens) && userObj.fcmTokens.length > 0
    };
};

module.exports = {
    buildUserLocationResponse,
    enrichUserWithLocation,
    formatUsersWithLocation,
    formatUserWithLocation
};
