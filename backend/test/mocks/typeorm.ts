import { Inject } from '@nestjs/common';

export const getRepositoryToken = (entity: any) => `${entity?.name || entity}Repository`;
export const InjectRepository = (entity: any) => Inject(getRepositoryToken(entity));

export const TypeOrmModule = {
  forRoot: () => ({ module: class {}, providers: [] }),
  forFeature: () => ({ module: class {}, providers: [] }),
};
