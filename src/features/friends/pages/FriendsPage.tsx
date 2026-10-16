// import { motion } from "framer-motion";
// import { useSearchParams } from "react-router-dom";
// import { Tabs } from "@/components/ui/Tabs";
// import { BlockedList } from "../components/BlockedList";
// import { FriendsList } from "../components/FriendsList";
// import { RequestsPanel } from "../components/RequestsPanel";
// import { useFriends, useReceivedRequests } from "../hooks";

// type FriendsTab = "friends" | "requests" | "blocked";

// export function FriendsPage() {
//   const [params, setParams] = useSearchParams();
//   const raw = params.get("tab");
//   const tab: FriendsTab = raw === "requests" || raw === "blocked" ? raw : "friends";

//   const friends = useFriends();
//   const received = useReceivedRequests();
//   const pending = received.data?.filter((r) => r.status === "pending").length ?? 0;

//   const tabs: { value: FriendsTab; label: string }[] = [
//     { value: "friends", label: `Friends${friends.data ? ` (${friends.data.length})` : ""}` },
//     { value: "requests", label: `Requests${pending ? ` (${pending})` : ""}` },
//     { value: "blocked", label: "Blocked" },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold tracking-tight">Friends</h2>
//         <p className="text-sm text-muted-foreground">
//           Manage your friends, requests and blocked people.
//         </p>
//       </div>

//       <Tabs
//         tabs={tabs}
//         value={tab}
//         onChange={(t) => setParams(t === "friends" ? {} : { tab: t }, { replace: true })}
//       />

//       <motion.div
//         key={tab}
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.25 }}
//       >
//         {tab === "friends" && <FriendsList />}
//         {tab === "requests" && <RequestsPanel />}
//         {tab === "blocked" && <BlockedList />}
//       </motion.div>
//     </div>
//   );
// }
import { motion } from "framer-motion";
import { Navigate, useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/Tabs";
import { BlockedList } from "../components/BlockedList";
import { FriendsList } from "../components/FriendsList";
import { useFriends } from "../hooks";

type MatchesTab = "matches" | "blocked";

export function FriendsPage() {
  const [params, setParams] = useSearchParams();
  const friends = useFriends();

  // Old links to the requests tab now live on the Likes page.
  if (params.get("tab") === "requests") return <Navigate to="/likes" replace />;

  const tab: MatchesTab = params.get("tab") === "blocked" ? "blocked" : "matches";

  const tabs: { value: MatchesTab; label: string }[] = [
    { value: "matches", label: `Matches${friends.data ? ` (${friends.data.length})` : ""}` },
    { value: "blocked", label: "Blocked" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Matches</h2>
        <p className="text-sm text-muted-foreground">
          People you matched with, and people you've blocked.
        </p>
      </div>

      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(t) => setParams(t === "matches" ? {} : { tab: t }, { replace: true })}
      />

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === "matches" ? <FriendsList /> : <BlockedList />}
      </motion.div>
    </div>
  );
}