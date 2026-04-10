const Certification = require("../model/certification.model");

/**
 * Calculate user compliance status against job type requirements
 * @param {string} userId - User ID
 * @param {Array<string>} requiredCertifications - Required certification names for the job type
 * @returns {Promise<{isCompliant: boolean, missingCertifications: Array<string>, expiredCertifications: Array<{name: string, expiryDate: Date}>}>}
 */
exports.calculateComplianceStatus = async (userId, requiredCertifications = []) => {
  try {
    // Get all certifications for the user
    const userCertifications = await Certification.find({ userId });

    // Extract certification names
    const userCertNames = userCertifications.map((cert) =>
      cert.certificationName.toLowerCase().trim()
    );

    // Normalize required certifications
    const normalizedRequired = requiredCertifications.map((cert) =>
      cert.toLowerCase().trim()
    );

    // Check for missing certifications
    const missingCertifications = normalizedRequired.filter(
      (required) => !userCertNames.includes(required)
    );

    // Check for expired certifications
    const now = new Date();
    const expiredCertifications = userCertifications
      .filter((cert) => cert.expiryDate < now)
      .map((cert) => ({
        name: cert.certificationName,
        expiryDate: cert.expiryDate
      }));

    // Determine compliance
    const isCompliant =
      missingCertifications.length === 0 && expiredCertifications.length === 0;

    return {
      isCompliant,
      missingCertifications,
      expiredCertifications
    };
  } catch (err) {
    console.error("Error calculating compliance status:", err);
    throw err;
  }
};
