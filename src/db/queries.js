const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Company {
  async insert(name) {
    try {
      let company = await prisma.company.create({
        data: {
          name: name,
        },
      });

      return company;
    } catch (error) {
      throw error;
    }
  }
}

class Student {
  async insert(name) {
    try {
      let user = await prisma.student.create({
        data: { name },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { Company, Student };
