export interface Picture {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  publicId?: string;
  clientId?: string;
  file?: File; // Made optional
}
