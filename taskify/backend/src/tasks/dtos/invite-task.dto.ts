import { IsEmail, IsString } from 'class-validator';

export class InviteTaskDto {
  @IsEmail()
  email: string;

  @IsString()
  role: 'viewer' | 'editor';
} 