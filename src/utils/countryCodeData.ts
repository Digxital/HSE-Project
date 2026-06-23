import { getCountries, getCountryCallingCode } from 'libphonenumber-js';

export interface CountryCode {
  code: string;
  name: string;
  callingCode: string;
}

export const getCountryCodesData = (): CountryCode[] => {
  const countries = getCountries();
  
  return countries
    .map((countryCode) => {
      const callingCode = getCountryCallingCode(countryCode);
      // Map country codes to country names
      const countryNames: { [key: string]: string } = {
        US: 'United States',
        GB: 'United Kingdom',
        CA: 'Canada',
        AU: 'Australia',
        NG: 'Nigeria',
        ZA: 'South Africa',
        KE: 'Kenya',
        GH: 'Ghana',
        IN: 'India',
        PK: 'Pakistan',
        BD: 'Bangladesh',
        SG: 'Singapore',
        MY: 'Malaysia',
        TH: 'Thailand',
        PH: 'Philippines',
        ID: 'Indonesia',
        VN: 'Vietnam',
        JP: 'Japan',
        CN: 'China',
        KR: 'South Korea',
        DE: 'Germany',
        FR: 'France',
        IT: 'Italy',
        ES: 'Spain',
        NL: 'Netherlands',
        SE: 'Sweden',
        NO: 'Norway',
        DK: 'Denmark',
        FI: 'Finland',
        PL: 'Poland',
        BR: 'Brazil',
        MX: 'Mexico',
        AR: 'Argentina',
        CL: 'Chile',
        CO: 'Colombia',
        PE: 'Peru',
      };

      return {
        code: countryCode,
        name: countryNames[countryCode] || countryCode,
        callingCode: `+${callingCode}`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};
