import { IsNumber, IsString } from 'class-validator';

export class ShareTaskDto {
  @IsNumber()
  userId: number;

  @IsString()
  role: 'viewer' | 'editor';
} 