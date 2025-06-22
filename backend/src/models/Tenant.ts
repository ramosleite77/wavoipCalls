import {
    Table,
    Column,
    Model,
    DataType,
    BeforeCreate,
    BeforeUpdate,
  } from 'sequelize-typescript';
  import { hash } from 'bcryptjs';
  
  @Table
  class Tenant extends Model {
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
    name!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    })
    email!: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    passwordHash!: string;
  
    @Column({
      type: DataType.VIRTUAL,
    })
    password?: string;
  
    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(instance: Tenant): Promise<void> {
      if (instance.password) {
        instance.passwordHash = await hash(instance.password, 8);
      }
    }
  
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
  
  export default Tenant;
  