import { createPost } from "@/lib/actions";
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

export default function NewPostPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>글쓰기</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createPost} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" name="title" required maxLength={200} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author">작성자</Label>
            <Input id="author" name="author" required maxLength={50} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              required
              rows={12}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">등록</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
