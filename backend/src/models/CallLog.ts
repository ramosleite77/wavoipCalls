import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Call from './Call';
import Tenant from './Tenant';

@Table
class CallLog extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Call)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  callId!: number;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tenantId!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  option!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;
}

export default CallLog; 