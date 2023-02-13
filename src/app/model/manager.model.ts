import { Employee } from './employee.model';

export class Manager {
  public id!: number;
  public name!: string;
  public reportees!: Employee[];
  public allocation!: number;
  public memberWiseAllocationVisible: boolean = true;
}
