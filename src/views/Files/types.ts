export interface File {
  id: string;
  title: string;
  description: string;
  content?: string;
  isSearchable?: boolean;
  isAlwaysOn?: boolean;
}

export type FilesResponse = File[];

export interface FileFormValues {
  title: string;
  description: string;
  content: string;
  isSearchable: boolean;
  isAlwaysOn: boolean;
}

