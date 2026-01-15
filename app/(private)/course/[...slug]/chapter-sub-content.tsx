export function ChapterSubContent({ subContent }: { subContent: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-xs text-muted-foreground">-</div>
      {subContent}
    </div>
  );
}
