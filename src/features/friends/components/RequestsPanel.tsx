// import type { ReactNode } from "react";
// import { Inbox, Send } from "lucide-react";
// import { EmptyState } from "@/components/common/EmptyState";
// import { ErrorState } from "@/components/common/ErrorState";
// import { Button } from "@/components/ui/Button";
// import { Skeleton } from "@/components/ui/Skeleton";
// import { timeAgo } from "@/lib/date";
// import { getErrorMessage } from "@/lib/errors";
// import {
//   useAcceptRequest,
//   useCancelRequest,
//   useReceivedRequests,
//   useRejectRequest,
//   useSentRequests,
// } from "../hooks";
// import { personName } from "../utils";
// import { PersonRow } from "./PersonRow";

// function Section({ title, count, children }: { title: string; count: number; children: ReactNode }) {
//   return (
//     <section className="space-y-3">
//       <h3 className="flex items-center gap-2 text-sm font-semibold">
//         {title}
//         {count > 0 && (
//           <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{count}</span>
//         )}
//       </h3>
//       {children}
//     </section>
//   );
// }

// export function RequestsPanel() {
//   const received = useReceivedRequests();
//   const sent = useSentRequests();
//   const accept = useAcceptRequest();
//   const reject = useRejectRequest();
//   const cancel = useCancelRequest();

//   const incoming = (received.data ?? []).filter((r) => r.status === "pending");
//   const outgoing = (sent.data ?? []).filter((r) => r.status === "pending");

//   return (
//     <div className="space-y-8">
//       <Section title="Received" count={incoming.length}>
//         {received.isLoading ? (
//           <Skeleton className="h-[74px]" />
//         ) : received.isError ? (
//           <ErrorState message={getErrorMessage(received.error)} onRetry={() => received.refetch()} />
//         ) : incoming.length === 0 ? (
//           <EmptyState
//             icon={<Inbox size={28} />}
//             title="No pending requests"
//             hint="When someone sends you a friend request, it will show up here."
//           />
//         ) : (
//           <div className="divide-y rounded-lg border bg-card">
//             {incoming.map((r) => (
//               <PersonRow
//                 key={r.id}
//                 userId={r.sender_id}
//                 name={personName(r.sender)}
//                 username={r.sender?.username}
//                 pictureUrl={r.sender?.profile_picture?.url}
//                 verified={r.sender?.is_verified}
//                 subtitle={timeAgo(r.created_at)}
//                 actions={
//                   <>
//                     <Button
//                       size="sm"
//                       loading={accept.isPending && accept.variables === r.id}
//                       disabled={reject.isPending && reject.variables === r.id}
//                       onClick={() => accept.mutate(r.id)}
//                     >
//                       Accept
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       loading={reject.isPending && reject.variables === r.id}
//                       disabled={accept.isPending && accept.variables === r.id}
//                       onClick={() => reject.mutate(r.id)}
//                     >
//                       Decline
//                     </Button>
//                   </>
//                 }
//               />
//             ))}
//           </div>
//         )}
//       </Section>

//       <Section title="Sent" count={outgoing.length}>
//         {sent.isLoading ? (
//           <Skeleton className="h-[74px]" />
//         ) : sent.isError ? (
//           <ErrorState message={getErrorMessage(sent.error)} onRetry={() => sent.refetch()} />
//         ) : outgoing.length === 0 ? (
//           <EmptyState
//             icon={<Send size={28} />}
//             title="No sent requests"
//             hint="Requests you send will wait here until the other person responds."
//           />
//         ) : (
//           <div className="divide-y rounded-lg border bg-card">
//             {outgoing.map((r) => (
//               <PersonRow
//                 key={r.id}
//                 userId={r.receiver_id}
//                 name={personName(r.receiver)}
//                 username={r.receiver?.username}
//                 pictureUrl={r.receiver?.profile_picture?.url}
//                 verified={r.receiver?.is_verified}
//                 subtitle={`Sent ${timeAgo(r.created_at)}`}
//                 actions={
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     loading={cancel.isPending && cancel.variables === r.id}
//                     onClick={() => cancel.mutate(r.id)}
//                   >
//                     Cancel
//                   </Button>
//                 }
//               />
//             ))}
//           </div>
//         )}
//       </Section>
//     </div>
//   );
// }