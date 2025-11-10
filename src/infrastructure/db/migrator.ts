import { Sequelize } from "sequelize"
import { Umzug, SequelizeStorage } from 'umzug'
import { join } from 'path';

export const migrator = ( sequelize: Sequelize ) => {
    return new Umzug({
        migrations: {
            glob: join(__dirname, 'migrations/*.ts')
        },
        logger: undefined,
        context: sequelize,
        storage: new SequelizeStorage({ sequelize }),
    });
}