
export enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export type AppStatus = Status.Idle | Status.Loading | Status.Success | Status.Error;

export interface ImageFile {
  file: File;
  preview: string;
}
