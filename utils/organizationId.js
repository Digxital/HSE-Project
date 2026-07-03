const Organization = require("../model/organization.model");

const ORG_ID_PREFIX = "ORG-";
const ORG_ID_PATTERN = /^ORG-\d+$/;

// Generates the next sequential organizationId (e.g. ORG-0001, ORG-0002).
exports.generateNextOrganizationId = async () => {
    const [latest] = await Organization.aggregate([
        {
            $match: {
                organizationId: { $regex: ORG_ID_PATTERN }
            }
        },
        {
            $project: {
                seq: {
                    $toInt: {
                        $substr: [
                            "$organizationId",
                            ORG_ID_PREFIX.length,
                            {
                                $subtract: [
                                    { $strLenCP: "$organizationId" },
                                    ORG_ID_PREFIX.length
                                ]
                            }
                        ]
                    }
                }
            }
        },
        { $sort: { seq: -1 } },
        { $limit: 1 }
    ]);

    const nextSeq = latest ? latest.seq + 1 : 1;

    return `${ORG_ID_PREFIX}${String(nextSeq).padStart(4, "0")}`;
};
