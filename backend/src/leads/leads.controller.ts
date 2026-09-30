import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactDto, SubscribeDto } from './leads.dto.js';
import { LeadsService } from './leads.service.js';

@Controller()
@Throttle({ default: { limit: 5, ttl: 60_000 } })
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post('newsletter')
  @HttpCode(201)
  subscribe(@Body() dto: SubscribeDto) {
    return this.leads.subscribe(dto);
  }

  @Post('contact')
  @HttpCode(201)
  contact(@Body() dto: ContactDto) {
    return this.leads.contact(dto);
  }
}
