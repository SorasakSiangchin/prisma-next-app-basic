import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = Number(params.id);
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ข้อมูลที่จะ update
    const { title, content, categoryId } = await request.json();
    // id ที่ส่งมา
    const postId = Number(params.id);
    const updatePost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        categoryId: Number(categoryId),
      },
    });

    return NextResponse.json(updatePost);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = Number(params.id);
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json(deletedPost);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}
