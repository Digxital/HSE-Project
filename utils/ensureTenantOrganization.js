const Organization = require("../model/organization.model");
const User = require("../model/user.model");
const Client = require("../model/client.model");
const { generateNextOrganizationId } = require("./organizationId");

const ORGANIZATION_SELECT_FIELDS =
    "clientId organizationName organizationAddress primaryContactPersonName contactEmail contactPhoneNumber adminUserId status organizationId logo createdAt updatedAt";

const formatOrganizationResponse = (organization) => {
    if (!organization) {
        return null;
    }

    const org = organization.toObject ? organization.toObject() : organization;

    return {
        id: org._id.toString(),
        organizationId: org.organizationId,
        organizationName: org.organizationName,
        primaryContactPersonName: org.primaryContactPersonName || null,
        contactEmail: org.contactEmail || null,
        contactPhoneNumber: org.contactPhoneNumber || null,
        organizationAddress: org.organizationAddress || null,
        status: org.status,
        logo: org.logo || null,
        clientId: org.clientId ? org.clientId.toString() : null,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt
    };
};

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
    let organization = await Organization.findById(tenantId).select(ORGANIZATION_SELECT_FIELDS);

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
            return Organization.findById(tenantId).select(ORGANIZATION_SELECT_FIELDS);
        }
        throw error;
    });

    if (!organization) {
        return null;
    }

    return ensureTenantClient(organization);
};

module.exports = {
    ensureTenantOrganization,
    formatOrganizationResponse
};
