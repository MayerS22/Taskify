import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { randomBytes } from 'crypto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashedPassword, firstName, lastName);
    return { message: 'User registered successfully', userId: user.id };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { message: 'Login successful', access_token: token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    // Always return generic message
    if (!user) {
      return { message: 'If this email exists, a password reset link has been sent.' };
    }
    // Generate secure token and expiry (1 hour)
    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await this.usersService['usersRepository'].save(user);

    // Send email using Ethereal
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: 'Taskify <no-reply@taskify.com>',
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="http://localhost:3000/auth/reset-password?token=${token}">here</a> to reset your password.</p>`
    });
    console.log('Password reset email sent. Preview URL: ' + nodemailer.getTestMessageUrl(info));

    return { message: 'If this email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const user = await this.usersService['usersRepository'].findOne({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return { message: 'Invalid or expired token.' };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await this.usersService['usersRepository'].save(user);
    return { message: 'Password has been reset successfully.' };
  }
}
