import { FaExclamation } from "react-icons/fa";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/libs/separator";

export type HeaderSidebar = {title: string, description: string}

export default function HeaderHoverCard({title, description}: HeaderSidebar) {
  return (
    <>
        <div className="flex flex-wrap justify-between text-zinc-200 items-center">
            <h1 className="font-bold text-lg">{title}</h1>
            <HoverCard>
                <HoverCardTrigger className="p-1 border border-zinc-200 rounded-full cursor-pointer">
                    <FaExclamation className="text-[10px] text-zinc-200"/>
                </HoverCardTrigger>
                <HoverCardContent dir="right" className="bg-[#282828] shadow-lg text-zinc-200">
                    <h2 className="text-sm">{title}</h2>
                    <Separator className="my-2" />
                    <p className="text-justify text-xs">{description}</p>
                </HoverCardContent>
            </HoverCard>
        </div>
        <Separator className="my-3 bg-zinc-800 h-[1.5px]"/>
    </>
  )
}
