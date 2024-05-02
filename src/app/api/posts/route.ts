import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const sort = searchParams.get("sort") || "desc";

    console.log({
      search,
      categoryId,
      sort,
    });

    const whereCondition = categoryId
      ? {
          // กรณีที่ค้นหาด้วยชื่อ จะค้นหาข้าม table
          // categoryId : {
          //   is : {
          //     name : category
          //   }
          // }
          categoryId: Number(categoryId),
          title: {
            contains: search,
            mode: "insensitive", // ไม่สนตัวพิมพ์ใหญ่และเล็ก
          },
        }
      : {
          title: {
            contains: search,
            mode: "insensitive",
          },
        };

    const posts = await prisma.post.findMany({
      where: whereCondition as any,
      orderBy: {
        createAt: sort,
      } as any,
      include: {
        category: true,
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, categoryId } = await request.json();
    const newPrisma = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: Number(categoryId),
      },
    });
    return NextResponse.json(newPrisma);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}
