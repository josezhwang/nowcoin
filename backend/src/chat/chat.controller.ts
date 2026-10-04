import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ChatDto } from './chat.dto.js';
import { ChatService } from './chat.service.js';

@Controller('chat')
@Throttle({ default: { limit: 20, ttl: 60_000 } })
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  @HttpCode(200)
  reply(@Body() dto: ChatDto) {
    return this.chat.reply(dto.messages);
  }
}
