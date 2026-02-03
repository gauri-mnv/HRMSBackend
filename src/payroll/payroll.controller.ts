import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  findAll() {
    return this.payrollService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyPayroll(@Req() req: any) {
    const userId = req.user?.userId ?? req.user?.sub ?? req.user?.id;
    if (!userId) return [];
    return this.payrollService.getByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(id);
  }

  @Post('add')
  create(@Body() dto: CreatePayrollDto) {
    return this.payrollService.create(dto);
  }

  @Post('seed')
  seedApproxPayments() {
    return this.payrollService.seedApproxPayments();
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePayrollDto) {
    return this.payrollService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(id);
  }
}
