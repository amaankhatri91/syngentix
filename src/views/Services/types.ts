export interface Service {
  id: string;
  name: string;
  serviceType: string;
  username: string;
  host: string;
  port: string;
  avatar?: string;
}

export interface ServiceFormValues {
  connectionName: string;
  hostName: string;
  port: string;
  username: string;
  password: string;
  securitySSL: File | null;
}

