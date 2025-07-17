import axios from 'axios';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,idd');
    
    return response.data
      .filter((country: any) => 
        country.idd && 
        country.idd.root && 
        country.idd.suffixes && 
        country.idd.suffixes.length > 0
      )
      .map((country: any) => ({
        name: country.name.common,
        code: country.name.common.substring(0, 2).toUpperCase(),
        dialCode: `${country.idd.root}${country.idd.suffixes[0]}`,
        flag: country.flags.svg,
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    
    // Return some default countries if API fails
    return [
      { name: 'United States', code: 'US', dialCode: '+1', flag: 'https://flagcdn.com/us.svg' },
      { name: 'India', code: 'IN', dialCode: '+91', flag: 'https://flagcdn.com/in.svg' },
      { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: 'https://flagcdn.com/gb.svg' },
      { name: 'Canada', code: 'CA', dialCode: '+1', flag: 'https://flagcdn.com/ca.svg' },
      { name: 'Australia', code: 'AU', dialCode: '+61', flag: 'https://flagcdn.com/au.svg' },
    ];
  }
}; 