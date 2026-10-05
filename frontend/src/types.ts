export interface DigitalAsset {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  category?: string;
  ipfsHash?: string;
  status?: string;
  nomineeId?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface Nominee {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  relationship?: string;
  [key: string]: any;
}