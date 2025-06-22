import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Tenant from './Tenant';

@Table
class Call extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customerNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assistantId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumberId!: string;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tenantId!: number;

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

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduleAt!: Date;
}

export default Call; 