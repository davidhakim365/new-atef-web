import { useAssistantsQuery } from "@/api/assistants-api";
import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useModalStore } from "@/store/use-modal-store";
import { Assistant } from "@/types/assistants";
import { Edit2, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AssistantsPage = () => {
  const { data: assistants, isLoading } = useAssistantsQuery();
  const { openModal } = useModalStore();

  if (isLoading) {
    return (
      <div className="flex items-center w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 p-4 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Assistants</h1>
          <p className="text-sm text-muted-foreground">Manage staff access and permissions</p>
        </div>
        <Button onClick={() => openModal("add-assistant-modal")}>
          Add Assistant
        </Button>
      </div>
      <AssistantsList assistants={assistants?.data!.items!} />
    </div>
  );
};

function AssistantsList({ assistants }: { assistants: Assistant[] }) {
  return (
    <div className="flex flex-col gap-2 p-4 ">
      {assistants?.map((assistant) => (
        <AssistantListItem key={assistant.id} assistant={assistant} />
      ))}
    </div>
  );
}

function AssistantListItem({ assistant }: { assistant: Assistant }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-950/40">
      <div className="flex items-center justify-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          <Shield />
        </div>
        <div className="text-xl text-foreground">{assistant.email}</div>
      </div>
      <div className="flex items-center">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@permissions</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit">
            {assistant.permissions?.map((permission) => (
              <div className="text-sm text-indigo-700 dark:text-indigo-300" key={permission}>
                {permission}
              </div>
            ))}
          </HoverCardContent>
        </HoverCard>
        <Link to={`/dashboard/assistants/${assistant.id}`}>
          <Button size="icon" variant={"link"}>
            <Edit2 />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AssistantsPage;
