import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport:
        'smtps://paulofullstack@hotmail.com:sInAKP6RqQB3w1SW@smtp-relay.brevo.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    // ThrottlerModule.forRoot([{
    //   ttl: 60000,
    //   limit: 10,
    // }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // }
  ],
})
export class AppModule {}
