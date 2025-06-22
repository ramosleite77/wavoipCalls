import {
    Table,
    Column,
    Model,
    DataType,
    BeforeCreate,
    BeforeUpdate,
  } from 'sequelize-typescript';
  import { hash, compare } from 'bcryptjs';
  
  @Table
  class User extends Model {
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
      allowNull: true,
    })
    password?: string;
  
    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(instance: User): Promise<void> {
      if (instance.password) {
        instance.passwordHash = await hash(instance.password, 8);
      }
    }
  
    async checkPassword(password: string): Promise<boolean> {
      return compare(password, this.passwordHash);
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
  
  export default User;
  