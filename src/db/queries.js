const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Internship {
  async insert(
    startDate,
    endDate,
    description,
    compName,
    stuName,
    tags = null
  ) {
    return await prisma.internship.create({
      data: {
        startDate,
        endDate,
        description,
        companyId: "ajaja",
        studentId: "hahaha",
        InternshipTag: {
          createMany: {},
        },
      },
    });
  }
}

class Student {
  async insert(name) {
    let user = await prisma.student.upsert({
      update: {},
      where: { name },
      create: {
        name,
      },
    });

    return user;
  }
}

class Company {
  async insert(name) {
    let company = await prisma.company.upsert({
      update: {},
      where: { name },
      create: {
        name,
      },
    });
    return company;
  }
}

class Tag {
  async insert(name) {
    let tag = await prisma.tag.upsert({
      update: {},
      where: { name },
      create: {
        name,
      },
    });
    return tag;
  }

  async find(name) {
    let tag = await prisma.tag.findFirst({
      where: { name },
    });
    return tag;
  }
}

module.exports = { Company, Student, Tag, Internship };
