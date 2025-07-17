import axios from 'axios';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

// Define interfaces for the API response
interface CountryName {
  common: string;
  official: string;
}

interface CountryFlags {
  svg: string;
  png: string;
}

interface CountryIdd {
  root: string;
  suffixes: string[];
}

interface ApiCountry {
  name: CountryName;
  flags: CountryFlags;
  idd: CountryIdd;
}

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<ApiCountry[]>(
      'https://restcountries.com/v3.1/all?fields=name,flags,idd'
    );

    return response.data
      .filter((country) => 
        country.idd && 
        country.idd.root && 
        country.idd.suffixes && 
        country.idd.suffixes.length > 0
      )
      .map((country) => ({
        name: country.name.common,
        code: country.name.common.substring(0, 2).toUpperCase(),
        dialCode: `${country.idd.root}${country.idd.suffixes[0]}`,
        flag: country.flags.svg,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    
    // Return default countries
    return [
      { name: 'United States', code: 'US', dialCode: '+1', flag: 'https://flagcdn.com/us.svg' },
      { name: 'India', code: 'IN', dialCode: '+91', flag: 'https://flagcdn.com/in.svg' },
      { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: 'https://flagcdn.com/gb.svg' },
      { name: 'Canada', code: 'CA', dialCode: '+1', flag: 'https://flagcdn.com/ca.svg' },
      { name: 'Australia', code: 'AU', dialCode: '+61', flag: 'https://flagcdn.com/au.svg' },
    ];
  }
};