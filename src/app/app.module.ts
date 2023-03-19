import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Request, Response } from 'express';
import GraphQLJSON from 'graphql-type-json';

import { AccountModule } from '@/app/account/account.module';
import { AccountSessionModule } from '@/app/account-session/account-session.module';
import { AuthModule } from '@/app/auth/auth.module';
import { DebugModule } from '@/app/debug/debug.module';
import { EmailModule } from '@/app/email/email.module';
import { GqlContext } from '@/app/gql-context';
import { OneTimeCodeModule } from '@/app/one-time-code/one-time-code.module';
import { Page404Filter } from '@/app/page-404/page-404.filter';
import { CryptoModule } from '@/common/crypto/crypto.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { LoggerServeModule } from '@/common/logger-serve/logger-serve.module';
import { PrismaModule } from '@/common/prisma/prisma.module';

import { FileUploadController } from './file-upload/file-upload.controller';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      playground: true,
      introspection: true,
      persistedQueries: false,
      resolvers: { JSON: GraphQLJSON },
      context: ({ req, res }: { req: Request; res: Response }): GqlContext => ({
        req,
        res,
        account: undefined,
        accountSession: undefined,
      }),
    }),
    AccountModule,
    AuthModule,
    AccountSessionModule,
    AuthModule,
    AccountSessionModule,
    CryptoModule,
    DebugModule,
    OneTimeCodeModule,
    EmailModule,
    LoggerModule,
    PrismaModule,
    LoggerServeModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: Page404Filter,
    },
  ],
  controllers: [FileUploadController, HealthController],
})
export class AppModule {}
