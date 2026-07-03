const TWELVE_HOUR_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i;
const TWENTY_FOUR_HOUR_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

const pad = value => String(value).padStart(2, "0");

const isValidMinutes = minutes => {
    const parsed = parseInt(minutes, 10);
    return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 59;
};

const to24Hour = (hours12, minutes, period) => {
    let hours = parseInt(hours12, 10);
    const normalizedPeriod = period.toUpperCase();

    if (normalizedPeriod === "AM") {
        if (hours === 12) {
            hours = 0;
        }
    } else if (hours !== 12) {
        hours += 12;
    }

    return `${pad(hours)}:${minutes}`;
};

const from24Hour = (hours24, minutes) => {
    let hours = parseInt(hours24, 10);
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) {
        hours = 12;
    }

    return {
        eventTime: `${pad(hours)}:${minutes} ${period}`,
        eventTimePeriod: period,
        eventTime24: `${pad(parseInt(hours24, 10))}:${minutes}`
    };
};

const normalizeInput = value =>
    String(value)
        .trim()
        .replace(/\s+/g, " ")
        .replace(/(AM|PM)$/i, match => ` ${match.toUpperCase()}`)
        .replace(/\s+/g, " ")
        .trim();

//  Parse and normalize an event time into 12-hour format with AM/PM.
//   Accepts: "2:30 PM", "02:30pm", "14:30"
exports.parseEventTime = input => {
    if (input === null || input === undefined || String(input).trim() === "") {
        return {
            ok: false,
            message: "eventTime is required"
        };
    }

    const normalizedInput = normalizeInput(input);
    const twelveHourMatch = normalizedInput.match(TWELVE_HOUR_PATTERN);

    if (twelveHourMatch) {
        const hours = parseInt(twelveHourMatch[1], 10);
        const minutes = twelveHourMatch[2];
        const period = twelveHourMatch[4].toUpperCase();

        if (hours < 1 || hours > 12) {
            return {
                ok: false,
                message: "eventTime hour must be between 1 and 12 for AM/PM format"
            };
        }

        if (!isValidMinutes(minutes)) {
            return {
                ok: false,
                message: "eventTime minutes must be between 00 and 59"
            };
        }

        return {
            ok: true,
            value: {
                eventTime: `${pad(hours)}:${minutes} ${period}`,
                eventTimePeriod: period,
                eventTime24: to24Hour(hours, minutes, period)
            }
        };
    }

    const twentyFourHourMatch = normalizedInput.match(TWENTY_FOUR_HOUR_PATTERN);

    if (twentyFourHourMatch) {
        const hours = parseInt(twentyFourHourMatch[1], 10);
        const minutes = twentyFourHourMatch[2];

        if (hours < 0 || hours > 23) {
            return {
                ok: false,
                message: "eventTime hour must be between 00 and 23 for 24-hour format"
            };
        }

        if (!isValidMinutes(minutes)) {
            return {
                ok: false,
                message: "eventTime minutes must be between 00 and 59"
            };
        }

        return {
            ok: true,
            value: from24Hour(hours, minutes)
        };
    }

    return {
        ok: false,
        message: 'eventTime must be in "hh:mm AM/PM" or "HH:mm" (24-hour) format'
    };
};

/**
 * Ensure report responses always include AM/PM details for eventTime.
 */
exports.enrichReportEventTime = report => {
    if (!report || !report.eventTime) {
        return report;
    }

    const parsed = exports.parseEventTime(report.eventTime);

    if (!parsed.ok) {
        return report;
    }

    return {
        ...report,
        eventTime: parsed.value.eventTime,
        eventTimePeriod: parsed.value.eventTimePeriod,
        eventTime24: parsed.value.eventTime24
    };
};
