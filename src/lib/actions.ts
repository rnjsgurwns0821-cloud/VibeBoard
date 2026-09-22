"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !author || !content) {
    throw new Error("제목, 작성자, 내용을 모두 입력해주세요.");
  }

  const post = await db.post.create({
    data: { title, author, content },
  });

  revalidatePath("/");
  redirect(`/posts/${post.id}`);
}

export async function updatePost(postId: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !author || !content) {
    throw new Error("제목, 작성자, 내용을 모두 입력해주세요.");
  }

  await db.post.update({
    where: { id: postId },
    data: { title, author, content },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: number) {
  await db.post.delete({ where: { id: postId } });
  revalidatePath("/");
  redirect("/");
}

export async function incrementViews(postId: number) {
  await db.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });
}

export async function createComment(postId: number, formData: FormData) {
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!author || !content) {
    throw new Error("작성자와 내용을 입력해주세요.");
  }

  await db.comment.create({
    data: { postId, author, content },
  });

  revalidatePath(`/posts/${postId}`);
}

export async function deleteComment(postId: number, commentId: number) {
  await db.comment.delete({ where: { id: commentId } });
  revalidatePath(`/posts/${postId}`);
}
