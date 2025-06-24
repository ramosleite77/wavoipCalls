import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Tenant from './Tenant';
import VapiToken from './VapiToken';

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

  @ForeignKey(() => VapiToken)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vapiTokenId!: number;

  @ForeignKey(() => Tenant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tenantId!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  executed!: boolean;

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

  @BelongsTo(() => VapiToken)
  vapiToken!: VapiToken;

  @BelongsTo(() => Tenant)
  tenant!: Tenant;
}

export default Call; 