import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? "1") || 1);

  const [posts, total] = await Promise.all([
    db.post.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { comments: true } } },
    }),
    db.post.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">게시판</h1>
        <Button asChild>
          <Link href="/posts/new">글쓰기</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-24 text-center text-muted-foreground">
          <p>아직 작성된 글이 없습니다.</p>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/posts/new">첫 글 작성하기</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">번호</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-32">작성자</TableHead>
              <TableHead className="w-28 text-center">작성일</TableHead>
              <TableHead className="w-16 text-center">조회</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="text-center text-muted-foreground">
                  {post.id}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/posts/${post.id}`}
                    className="font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                  {post._count.comments > 0 && (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      [{post._count.comments}]
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {post.author}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {formatDate(post.createdAt)}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {post.views}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page <= 1 ? (
            <Button variant="outline" size="sm" disabled>
              이전
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={`/?page=${page - 1}`}>이전</Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          {page >= totalPages ? (
            <Button variant="outline" size="sm" disabled>
              다음
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={`/?page=${page + 1}`}>다음</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
