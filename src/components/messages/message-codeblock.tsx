import { Button } from "@/components/ui/button"
import { useClipboard } from "@/hooks/use-clipboard";
import { FC, memo } from "react"
import { FaCheck, FaCopy } from "react-icons/fa6";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import AlertInput from "./alert-input";
import dynamic from 'next/dynamic';

export const SyntaxHighlighterLazyLoader = dynamic(() => import('react-syntax-highlighter').then(mod => mod.Prism), { ssr: false });

interface MessageCodeBlockProps {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css"
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = memo(
  ({ language, value }) => {
    const { isCopied, copyToClipboard } = useClipboard({ timeout: 2000 })

    const onCopy = () => {
      if (isCopied) return
      copyToClipboard(value)
    }

    return (
      <div className="codeblock relative bg-zinc-950 font-sans max-w-[300px] sm:max-w-xs md:max-w-lg lg:max-w-md xl:max-w-[720px]">
        <div className="flex w-full items-center justify-between bg-zinc-700 px-4 text-white">
          <span className="text-xs lowercase">{language}</span>
          <div className="flex items-center space-x-1">
            <AlertInput value={value} language={language} />
            <Button
              variant="ghost"
              size="icon"
              className="text-xs hover:bg-zinc-300 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
              onClick={onCopy}
            >
              {isCopied ? <FaCheck size={16} /> : <FaCopy size={16} />}
            </Button>
          </div>
        </div>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
              margin: 0,
              width: "100%",
              background: "transparent"
          }}
          codeTagProps={{
              style: {
              fontSize: "14px",
              fontFamily: "var(--font-mono)"
              }
          }}
          >
          {value}
        </SyntaxHighlighter>
      </div>
    )
  }
)

MessageCodeBlock.displayName = "MessageCodeBlock"
