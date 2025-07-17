import { Controller, Get, Request, UseGuards, Body, Put, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(@Request() req, @Body() body: UpdateProfileDto) {
    const { firstName, lastName, bio, phone, profile, country } = body;
    return this.usersService.updateProfile(req.user.id, { firstName, lastName, bio, phone, profile, country });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile-pics',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }))
  async uploadProfilePicture(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file uploaded');
    const filePath = `/uploads/profile-pics/${file.filename}`;
    await this.usersService.updateProfile(req.user.id, { profile: filePath });
    return { url: filePath };
  }
}
