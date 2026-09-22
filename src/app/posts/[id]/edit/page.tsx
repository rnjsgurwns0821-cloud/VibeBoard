import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updatePost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EditPostPage({
  params,
}: PageProps<"/posts/[id]/edit">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) notFound();

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>글 수정</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={updatePostWithId} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              required
              maxLength={200}
              defaultValue={post.title}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author">작성자</Label>
            <Input
              id="author"
              name="author"
              required
              maxLength={50}
              defaultValue={post.author}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              required
              rows={12}
              className="resize-none"
              defaultValue={post.content}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">수정 완료</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
