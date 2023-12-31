import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, MongooseHealthIndicator, HealthCheck } from "@nestjs/terminus";
import { Public } from "src/decorator/customize";

//controller
@Controller('health')
export class HealthController {
constructor(
private health: HealthCheckService,
private db: MongooseHealthIndicator, // check tình trạng mongodb
) { }
@Get()
@Public()
@HealthCheck()
check() {
return this.health.check([
( ) => this.db.pingCheck('database'),
]);
}
}