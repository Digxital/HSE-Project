/**
 * ID Generator Service
 * 
 * Handles conversion of backend data to display IDs.
 * Currently uses temporary hash-based generation from ObjectId.
 * 
 * MIGRATION PLAN:
 * When backend provides `displayId` field in API response:
 * 1. Replace this entire function with: return apiReport.displayId
 * 2. Update reportService.ts to pass displayId instead of backendId
 * 3. Delete this file
 */

interface ReportData {
  _id: string;
  recordType: 'hazard' | 'incident';
  displayId?: string; // Will be added by backend in future
}

export function generateDisplayId(report: ReportData): string {
  const prefix = report.recordType === 'hazard' ? 'HAZ' : 'INC';

  // TEMPORARY: Use backend-provided displayId if available (for future)
  if (report.displayId) {
    return report.displayId;
  }

  // TEMPORARY: Extract more digits from MongoDB ObjectId for better uniqueness
  // MongoDB ObjectId is 24 hex chars, each report gets unique _id
  // Extract last 6 hex chars and convert to decimal for 4-digit number
  const hexPart = report._id.slice(-6); // Get last 6 hex chars
  const decimalValue = parseInt(hexPart, 16); // Convert hex to decimal
  const number = decimalValue % 10000; // Keep to 4 digits

  return `${prefix}-${String(number).padStart(4, '0')}`;
}

/**
 * Usage in reportService.ts:
 * Before: const displayId = generateReportId(apiReport.recordType, apiReport._id);
 * After:  const displayId = generateDisplayId(apiReport);
 * 
 * When backend adds displayId:
 * Just change the function to: return report.displayId || generateDisplayId(report);
 */
