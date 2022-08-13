const dict = {
  en: {
    custom: {
      'postalAddress.streetAddress': {
        required: 'Address line 1 is required',
      },
      'postalAddress.addressLocality': {
        required: 'City is required',
      },
      'postalAddress.addressCountry': {
        required: 'Country is required',
      },
      'postalAddress.addressRegion': {
        required: 'State is required',
      },
      'postalAddress.postalCode': {
        required: 'Zipcode is required',
      },
      'email': {
        required: 'Your email is empty',
        email: 'Your email is invalid',
      },
    },
  },
};

export default { dict };
