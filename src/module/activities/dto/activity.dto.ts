import ObjectBaseEntity from '../../common/service/base-entity';

type EntityName = 'users';

export class ActivityDto {
  constructor(
    public description: string,
    public entityName: EntityName,
    public entity: ObjectBaseEntity,
  ) {}
}
