import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
    ForeignKey,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import FileResource from './file.resource.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'FileResourceReference',
    tableName       : 'file_resource_references',
    paranoid        : true,
    freezeTableName : true,
})
export default class FileResourceReference extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ResourceId: string;
    
    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ReferenceItemId: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    ReferenceType: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
