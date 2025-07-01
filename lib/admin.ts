import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new admin
export async function createAdmin(email: string, password: string, imagesUrl: string[] = []) {
  return prisma.admin.create({
    data: {
      email,
      password,
      imagesUrl,
    },
  });
}

// Get all admins
export async function getAllAdmins() {
  return prisma.admin.findMany();
}

// Get admin by email
export async function getAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
  });
}

// Update admin by id
export async function updateAdmin(id: string, data: Partial<{ email: string; password: string; imagesUrl: string[] }>) {
  return prisma.admin.update({
    where: { id },
    data,
  });
}

// Delete admin by id
export async function deleteAdmin(id: string) {
  return prisma.admin.delete({
    where: { id },
  });
} 