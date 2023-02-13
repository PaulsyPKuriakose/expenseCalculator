import { Manager } from './manager.model';

export class Department {
  public id!: number;
  public name!: string;
  public manager!: string;
  public members!: Manager[];
  public isCollapsed: boolean = true;
  public allocation: number = 300;
  public deptwiseAllocationVisible: boolean = true;
}
