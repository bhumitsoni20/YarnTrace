import { PrismaClient, UserStatus, YarnType, LotStatus, PartyType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding YarnTrace foundation data...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      name: 'Administrator',
      code: 'ADMIN',
      description: 'System administrator with unrestricted access',
      isSystem: true,
    },
  });

  const stockHeadRole = await prisma.role.upsert({
    where: { code: 'STOCK_HEAD' },
    update: {},
    create: {
      name: 'Stock Head',
      code: 'STOCK_HEAD',
      description: 'Head of yarn stock, inward lot reception, and issuance to production',
      isSystem: true,
    },
  });

  await prisma.role.upsert({
    where: { code: 'PRODUCTION_HEAD' },
    update: {},
    create: {
      name: 'Production Head',
      code: 'PRODUCTION_HEAD',
      description: 'Production team lead responsible for floor consumption and batch output',
      isSystem: true,
    },
  });

  await prisma.role.upsert({
    where: { code: 'QUALITY_HEAD' },
    update: {},
    create: {
      name: 'Quality Assurance Head',
      code: 'QUALITY_HEAD',
      description: 'QA inspection and lot approval',
      isSystem: true,
    },
  });

  // 2. Granular Permissions
  const permissionsList = [
    { key: 'view_inventory', name: 'View Inventory', module: 'INVENTORY' },
    { key: 'add_yarn', name: 'Add Yarn', module: 'INVENTORY' },
    { key: 'issue_yarn', name: 'Issue Yarn', module: 'INVENTORY' },
    { key: 'update_stock', name: 'Update Stock', module: 'INVENTORY' },
    { key: 'manage_production', name: 'Manage Production', module: 'PRODUCTION' },
    { key: 'record_consumption', name: 'Record Consumption', module: 'PRODUCTION' },
    { key: 'manage_suppliers', name: 'Manage Suppliers', module: 'COMMERCIAL' },
    { key: 'manage_parties', name: 'Manage Parties', module: 'COMMERCIAL' },
    { key: 'manage_purchase_orders', name: 'Manage Purchase Orders', module: 'COMMERCIAL' },
    { key: 'view_traceability', name: 'View Traceability', module: 'TRACEABILITY' },
    { key: 'view_reports', name: 'View Reports', module: 'REPORTS' },
    { key: 'manage_users', name: 'Manage Users', module: 'GOVERNANCE' },
    { key: 'manage_roles', name: 'Manage Roles', module: 'GOVERNANCE' },
    { key: 'view_audit_logs', name: 'View Audit Logs', module: 'GOVERNANCE' },
    { key: 'edit_records', name: 'Edit Records', module: 'GOVERNANCE' },
    { key: 'delete_records', name: 'Delete Records', module: 'GOVERNANCE' },
  ];

  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { key: p.key },
      update: {},
      create: {
        key: p.key,
        name: p.name,
        module: p.module,
      },
    });

    // Assign to admin role
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // 3. Default Admin User
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@yarntrace.com' },
    update: {
      passwordHash,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'admin@yarntrace.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+919876543210',
      status: UserStatus.ACTIVE,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log(`👤 Admin user configured:`);
  console.log(`   Email: ${adminUser.email}`);
  console.log(`   Password: Password123!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
