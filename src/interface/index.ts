export interface UserData {
  _id: string;
  staff_first_name: string;
  staff_last_name: string;
  staff_phone_number: string;
  username: string;
  password: string;
  img: string;
  staff_role: string;
  staff_created_at: string;
}

export interface IServiceData {
  _id: string;
  service_title: string;
  about_service: string;
  img: string;
  service_created_at: string;
}

export interface IPartners {
  _id: string;
  partner_title: string;
  about_partner: string;
  img: string;
  partner_created_at: string;
}
