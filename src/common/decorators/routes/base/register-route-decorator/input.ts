export type Input = {
  method: string,
  path?: string,
  status?: number;
  target: any;
  descriptor: PropertyDescriptor;
}