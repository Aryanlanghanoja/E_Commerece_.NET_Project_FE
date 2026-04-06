export interface Address {
  id: number;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt: string;
}

export interface CreateAddressRequest {
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: number;
}
