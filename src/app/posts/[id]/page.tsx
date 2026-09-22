import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createComment, deleteComment, deletePost, incrementViews } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DeleteButton } from "@/components/delete-button";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function PostDetailPage({
  params,
}: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const post = await db.post.findUnique({
    where: { id: postId },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });

  if (!post) notFound();

  await incrementViews(postId);

  return (
    <div className="flex flex-col gap-8">
      <article className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>{formatDateTime(post.createdAt)}</span>
            <span>조회 {post.views + 1}</span>
          </div>
        </div>
        <Separator />
        <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
        <Separator />
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href="/">목록으로</Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/posts/${post.id}/edit`}>수정</Link>
            </Button>
            <DeleteButton
              action={deletePost.bind(null, post.id)}
              description="게시글과 모든 댓글이 함께 삭제됩니다."
            />
          </div>
        </div>
      </article>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          댓글 {post.comments.length}개
        </h2>

        {post.comments.length > 0 && (
          <ul className="flex flex-col gap-3">
            {post.comments.map((comment) => (
              <li
                key={comment.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-3"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">
                    {comment.content}
                  </p>
                </div>
                <DeleteButton
                  action={deleteComment.bind(null, post.id, comment.id)}
                  label="삭제"
                  description="댓글을 삭제합니다."
                />
              </li>
            ))}
          </ul>
        )}

        <form
          action={createComment.bind(null, post.id)}
          className="flex flex-col gap-3 rounded-lg border p-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="comment-author">작성자</Label>
            <Input
              id="comment-author"
              name="author"
              required
              maxLength={50}
              className="max-w-xs"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="comment-content">댓글</Label>
            <Textarea
              id="comment-content"
              name="content"
              required
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              댓글 등록
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
