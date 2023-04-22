import { Module, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { cors } from 'cors';


@Module({
  imports: [UsuarioModule, ConfigModule.forRoot({envFilePath: '.env', isGlobal: true}), MongooseModule.forRoot(process.env.DB_URI), ProyectoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer){
    consumer.apply(cors()).forRoutes({ path: '*', method:RequestMethod.ALL})
  }

}
