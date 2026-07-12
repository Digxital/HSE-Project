const Organization = require("../model/organization.model");
const User = require("../model/user.model");
const Client = require("../model/client.model");
const { generateNextOrganizationId } = require("./organizationId");

const ensureTenantClient = async (organization) => {
    if (organization.clientId) {
        return organization;
    }

    const client = await Client.create({
        tenantId: organization._id,
        name: organization.organizationName,
        description: organization.organizationAddress
    });

    organization.clientId = client._id;
    await organization.save();

    return organization;
};

// Backfill org + client for legacy admins created before the organization flow existed.
const ensureTenantOrganization = async (tenantId) => {
    let organization = await Organization.findById(tenantId).select(
        "clientId organizationName organizationAddress adminUserId status organizationId logo createdAt updatedAt"
    );

    if (organization) {
        return ensureTenantClient(organization);
    }

    const adminUser = await User.findOne({
        tenantId,
        role: "ADMIN"
    }).select("firstName lastName email tenantId");

    if (!adminUser) {
        return null;
    }

    const organizationId = await generateNextOrganizationId();
    const primaryContactPersonName = `${adminUser.firstName} ${adminUser.lastName}`.trim();

    organization = await Organization.create({
        _id: tenantId,
        organizationName: `${primaryContactPersonName}'s Organization`,
        organizationId,
        primaryContactPersonName,
        contactEmail: adminUser.email,
        contactPhoneNumber: "N/A",
        organizationAddress: "N/A",
        status: "ACTIVE",
        adminUserId: adminUser._id
    }).catch(async (error) => {
        if (error.code === 11000) {
            return Organization.findById(tenantId).select(
                "clientId organizationName organizationAddress adminUserId status organizationId logo createdAt updatedAt"
            );
        }
        throw error;
    });

    if (!organization) {
        return null;
    }

    return ensureTenantClient(organization);
};

module.exports = {
    ensureTenantOrganization
};
