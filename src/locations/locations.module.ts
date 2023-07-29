import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsResolver } from './locations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { CaslModule } from 'src/casl/casl.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), CaslModule, SocketModule],
  providers: [LocationsResolver, LocationsService],
  exports: [LocationsService]
})
export class LocationsModule { }
