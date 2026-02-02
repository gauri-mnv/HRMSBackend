import { TypeOrmModule } from "@nestjs/typeorm";
import { LeaveApplication } from "./entities/leave-application.entity";
import { LeaveTypesController } from "./leave-types.controller";
import { LeaveType } from "./entities/leave-type.entity";
import { Employee } from "src/employee/employee.entity";
import { LeaveService } from "./entities/leave.service";
import { Module } from "@nestjs/common";



@Module({
    imports: [
      TypeOrmModule.forFeature([LeaveType, LeaveApplication, Employee]),
    ],
    controllers: [LeaveTypesController, LeaveTypesController],
    providers: [LeaveService],
    exports: [LeaveService],
  })
  export class LeavesModule {}