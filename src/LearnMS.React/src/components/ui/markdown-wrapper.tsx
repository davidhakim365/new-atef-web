import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownWrapperProps {
  children: string;
  className?: string;
}

export function MarkdownWrapper({ children, className }: MarkdownWrapperProps) {
  return (
    <div
      className={cn(
        "prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none",
        "prose-headings:break-words prose-p:break-words prose-li:break-words",
        "prose-a:pointer-events-auto prose-a:cursor-pointer prose-a:break-words",
        "overflow-hidden text-wrap hyphens-auto",
        "[&_*]:max-w-full [&_*]:overflow-hidden [&_*]:text-wrap",
        "prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-pre:break-words",
        "prose-code:break-words prose-code:whitespace-pre-wrap",
        "prose-table:overflow-x-auto prose-table:block prose-table:whitespace-nowrap",
        className
      )}
    >
      <ReactMarkdown
        components={{
          a: ({ ...props }) => <a {...props} target="_blank" />,
          // Handle long URLs and code blocks
          code: ({ className, children, ...props }) => (
            <code
              className={cn(
                "break-words whitespace-pre-wrap max-w-full overflow-hidden text-wrap",
                className
              )}
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ children, ...props }) => (
            <pre
              className="max-w-full overflow-x-auto break-words whitespace-pre-wrap"
              {...props}
            >
              {children}
            </pre>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
