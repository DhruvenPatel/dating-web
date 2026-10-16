// import { Clock, UserCheck, UserPlus } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import {
//   useAcceptRequest,
//   useCancelRequest,
//   useRelationships,
//   useSendRequest,
// } from "../hooks";

// export function RelationshipButton({ userId }: { userId: string }) {
//   const { get, isLoading } = useRelationships();
//   const send = useSendRequest();
//   const cancel = useCancelRequest();
//   const accept = useAcceptRequest();

//   if (isLoading) {
//     return (
//       <Button variant="outline" fullWidth disabled loading>
//         Loading
//       </Button>
//     );
//   }

//   const relation = get(userId);

//   switch (relation.status) {
//     case "friends":
//       return (
//         <div className="flex h-11 items-center justify-center gap-2 rounded-lg bg-success/10 text-sm font-semibold text-success">
//           <UserCheck size={16} /> Friends
//         </div>
//       );

//     case "pending_sent":
//       return (
//         <Button
//           variant="outline"
//           fullWidth
//           loading={cancel.isPending}
//           onClick={() => relation.requestId && cancel.mutate(relation.requestId)}
//         >
//           <Clock size={16} /> Cancel request
//         </Button>
//       );

//     case "pending_received":
//       return (
//         <Button
//           fullWidth
//           loading={accept.isPending}
//           onClick={() => relation.requestId && accept.mutate(relation.requestId)}
//         >
//           <UserCheck size={16} /> Accept request
//         </Button>
//       );

//     default:
//       return (
//         <Button fullWidth loading={send.isPending} onClick={() => send.mutate(userId)}>
//           <UserPlus size={16} /> Add friend
//         </Button>
//       );
//   }
// }
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  useAcceptRequest,
  useCancelRequest,
  useRelationships,
  useSendRequest,
} from "../hooks";

export function RelationshipButton({ userId }: { userId: string }) {
  const { get, isLoading } = useRelationships();
  const send = useSendRequest();
  const cancel = useCancelRequest();
  const accept = useAcceptRequest();

  if (isLoading) {
    return (
      <Button variant="outline" fullWidth disabled loading>
        Loading
      </Button>
    );
  }

  const relation = get(userId);

  switch (relation.status) {
    case "friends":
      return (
        <div className="flex h-11 items-center justify-center gap-2 rounded-lg bg-success/10 text-sm font-semibold text-success">
          <Sparkles size={16} /> Matched
        </div>
      );

    case "pending_sent":
      return (
        <Button
          variant="outline"
          fullWidth
          loading={cancel.isPending}
          onClick={() => relation.requestId && cancel.mutate(relation.requestId)}
        >
          <Heart size={16} fill="currentColor" className="text-primary" /> Liked · Undo
        </Button>
      );

    case "pending_received":
      return (
        <Button
          fullWidth
          loading={accept.isPending}
          onClick={() => relation.requestId && accept.mutate(relation.requestId)}
        >
          <Heart size={16} fill="currentColor" /> Like back
        </Button>
      );

    default:
      return (
        <Button fullWidth loading={send.isPending} onClick={() => send.mutate(userId)}>
          <Heart size={16} /> Like
        </Button>
      );
  }
}