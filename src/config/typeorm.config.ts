import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  host: 'mongodb',
  port: 27017,
  database: 'estudos',
  useUnifiedTopology: true,
  synchronize: true,
  autoLoadEntities: true,
};
