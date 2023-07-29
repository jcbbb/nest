import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SocketGateway } from 'src/socket/socket.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Processor("location")
export class LocationProcessor {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    private readonly socketGateway: SocketGateway,
  ) { }

  @Process("location")
  async processLocation(job: Job<Location>) {
    // do so important stuff 
    await new Promise(resolve => setTimeout(resolve, 5000))
    await this.locationsRepository.createQueryBuilder().update(Location).set({
      status: "active"
    }).where({ id: job.data.id }).execute()

    this.socketGateway.server.to(String(job.data.created_by)).emit("locationUpdated", { status: "active", id: job.data.id })
  }
}
