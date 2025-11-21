import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model';
import Role from './src/models/role.model';
import Permission from './src/models/permission.model';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI as string);

  // Permissions
  const permissions = [
    'user.read', 'user.create', 'user.update', 'user.delete',
    'user.activate', 'user.deactivate', 'user.assignRole',
    'role.read', 'role.create', 'role.update', 'role.delete',
    'role.attachPermission', 'role.detachPermission',
    'permission.read', 'permission.create', 'permission.update', 'permission.delete',
    'audit.read', 'settings.read', 'settings.update'
  ];
  await Permission.deleteMany({});
  const permDocs = await Permission.insertMany(permissions.map(name => ({ name })));

  // Roles
  await Role.deleteMany({});
  const adminRole = await Role.create({
    name: 'admin',
    permissions: permDocs.map(p => p._id)
  });
  const viewerRole = await Role.create({
    name: 'viewer',
    permissions: permDocs.filter(p => p.name.endsWith('.read')).map(p => p._id)
  });

  // Users
  await User.deleteMany({});
  await User.create({ email: 'admin@example.com', password: 'Admin1234', isVerified: true, roles: [adminRole._id] });
  for (let i = 1; i <= 5; i++) {
    await User.create({ email: `user${i}@example.com`, password: `User${i}pass`, isVerified: true, roles: [viewerRole._id] });
  }

  console.log('Seed terminé.');
  process.exit();
}

seed();
