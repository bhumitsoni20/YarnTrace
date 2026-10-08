import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { InventoryService } from './src/inventory/inventory.service';
import { DashboardService } from './src/dashboard/dashboard.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  console.log('Bootstrapping Nest context for performance test...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const inventoryService = app.get(InventoryService);
  const dashboardService = app.get(DashboardService);
  const prismaService = app.get(PrismaService);

  console.log('\\n--- WARMUP ---');
  await prismaService.$queryRaw`SELECT 1`;

  console.log('\\n--- MEASURING getLots() ---');
  const t0 = performance.now();
  const lots = await inventoryService.getLots({});
  const t1 = performance.now();
  console.log(`getLots() returned ${lots.length} lots in ${(t1 - t0).toFixed(2)} ms`);

  console.log('\\n--- MEASURING getOverview() [Request 1: Cache Miss] ---');
  const t2 = performance.now();
  const overview1 = await dashboardService.getOverview();
  const t3 = performance.now();
  console.log(`getOverview() Request 1 took ${(t3 - t2).toFixed(2)} ms`);

  console.log('\\n--- MEASURING getOverview() [Request 2: Cache Hit] ---');
  const t4 = performance.now();
  const overview2 = await dashboardService.getOverview();
  const t5 = performance.now();
  console.log(`getOverview() Request 2 took ${(t5 - t4).toFixed(2)} ms`);

  console.log('\\n--- WAIT 16s FOR TTL EXPIRY ---');
  await new Promise(resolve => setTimeout(resolve, 16000));
  
  console.log('\\n--- MEASURING getOverview() [Request 3: Cache Expired] ---');
  const t6 = performance.now();
  const overview3 = await dashboardService.getOverview();
  const t7 = performance.now();
  console.log(`getOverview() Request 3 took ${(t7 - t6).toFixed(2)} ms`);

  await app.close();
}

bootstrap().catch(console.error);
