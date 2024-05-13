interface Address {
  id: number;
  city: string;
  country_code: string;
  company: string | null;
  default_billing: boolean;
  default_shipping: boolean;
  telephone: string;
  fax: string | null;
  firstname: string;
  lastname: string;
  middlename: string | null;
  postcode: string | null;
  prefix: string | null;
  region_id: string | null;
  street: string[];
  suffix: string | null;
  vat_id: string | null;
  custom_attributes: {
    attribute_code: string,
    value: string,
  }[];
}

type ResCustomer = {
  email: string,
  fullName: string,
  lastname: string,
  firstname: string,
  prefix: string | null,
  suffix: string | null,
  taxvat: string | null,
  middlename: string | null,
  addresses: Address[],
  orders: {
    total_count: number,
    items: any[],
  },
}
