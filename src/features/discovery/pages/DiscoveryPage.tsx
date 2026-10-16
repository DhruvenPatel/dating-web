// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Search, SlidersHorizontal, X } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { Tabs } from "@/components/ui/Tabs";
// import { useDebouncedValue } from "@/hooks/useDebouncedValue";
// import type { DiscoveryFilters } from "@/types/discovery";
// import { FiltersPanel } from "../components/FiltersPanel";
// import { UserGrid } from "../components/UserGrid";
// import {
//   EMPTY_FILTERS,
//   FILTER_KEYS,
//   buildParams,
//   countActiveFilters,
//   readFilters,
// } from "../filters";
// import { flattenPages, useDiscoverUsers, useSuggestions } from "../hooks";

// type View = "explore" | "suggestions";

// const TABS: { value: View; label: string }[] = [
//   { value: "explore", label: "Explore" },
//   { value: "suggestions", label: "For you" },
// ];

// const CHIP_LABELS: Record<string, string> = {
//   gender: "Gender",
//   min_age: "Min age",
//   max_age: "Max age",
//   country: "Country",
//   state: "State",
//   city: "City",
//   language: "Language",
//   interest: "Interest",
// };

// export function DiscoveryPage() {
//   const [params, setParams] = useSearchParams();
//   const view: View = params.get("view") === "suggestions" ? "suggestions" : "explore";
//   const filters = useMemo(() => readFilters(params), [params]);
//   const activeCount = countActiveFilters(filters);

//   const [showFilters, setShowFilters] = useState(false);
//   const [searchText, setSearchText] = useState(filters.q);
//   const debounced = useDebouncedValue(searchText, 400);

//   const updateFilters = (patch: Partial<DiscoveryFilters>) =>
//     setParams(buildParams({ ...filters, ...patch }, view), { replace: true });

//   // Push the debounced search text into the URL.
//   useEffect(() => {
//     const q = debounced.trim();
//     if (q !== filters.q) updateFilters({ q });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debounced]);

//   const explore = useDiscoverUsers(filters, view === "explore");
//   const suggestions = useSuggestions(view === "suggestions");
//   const active = view === "explore" ? explore : suggestions;

//   const users = useMemo(() => flattenPages(active.data?.pages), [active.data]);
//   const total = active.data?.pages[0]?.pagination.total;

//   const clearAll = () => {
//     setSearchText("");
//     setParams(buildParams(EMPTY_FILTERS, view), { replace: true });
//   };

//   const chips = FILTER_KEYS.filter((k) => filters[k]).map((k) => ({
//     key: k,
//     label: `${CHIP_LABELS[k]}: ${filters[k]}`,
//   }));

//   return (
//     <div className="space-y-5">
//       <div>
//         <h2 className="text-2xl font-bold tracking-tight">Discover</h2>
//         <p className="text-sm text-muted-foreground">Find people who share your interests.</p>
//       </div>

//       <Tabs
//         tabs={TABS}
//         value={view}
//         onChange={(v) => setParams(buildParams(filters, v), { replace: true })}
//       />

//       {view === "explore" && (
//         <>
//           <div className="flex gap-2">
//             <div className="relative flex-1">
//               <Search
//                 size={18}
//                 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
//               />
//               <input
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 maxLength={100}
//                 placeholder="Search by name or username..."
//                 className="h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
//               />
//             </div>
//             <Button variant="outline" onClick={() => setShowFilters((s) => !s)}>
//               <SlidersHorizontal size={16} />
//               Filters
//               {activeCount > 0 && (
//                 <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">
//                   {activeCount}
//                 </span>
//               )}
//             </Button>
//           </div>

//           {showFilters && (
//             <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
//               <FiltersPanel
//                 key={params.toString()}
//                 filters={filters}
//                 onApply={(patch) => {
//                   updateFilters(patch);
//                   setShowFilters(false);
//                 }}
//                 onClear={clearAll}
//               />
//             </motion.div>
//           )}

//           {(chips.length > 0 || filters.online_only) && (
//             <div className="flex flex-wrap items-center gap-2">
//               {chips.map((c) => (
//                 <button
//                   key={c.key}
//                   onClick={() => updateFilters({ [c.key]: "" } as Partial<DiscoveryFilters>)}
//                   className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-medium text-primary hover:bg-primary/20"
//                 >
//                   {c.label} <X size={12} />
//                 </button>
//               ))}
//               {filters.online_only && (
//                 <button
//                   onClick={() => updateFilters({ online_only: false })}
//                   className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-medium text-primary hover:bg-primary/20"
//                 >
//                   Online now <X size={12} />
//                 </button>
//               )}
//               <button onClick={clearAll} className="text-xs font-medium text-muted-foreground hover:text-foreground">
//                 Clear all
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {total !== undefined && !active.isLoading && (
//         <p className="text-sm text-muted-foreground">
//           {total} {total === 1 ? "person" : "people"}{" "}
//           {view === "suggestions" ? "suggested for you" : "found"}
//         </p>
//       )}

//       <UserGrid
//         users={users}
//         isLoading={active.isLoading}
//         isError={active.isError}
//         error={active.error}
//         isStale={active.isPlaceholderData}
//         hasNext={!!active.hasNextPage}
//         isFetchingNext={active.isFetchingNextPage}
//         fetchNext={() => active.fetchNextPage()}
//         onRetry={() => active.refetch()}
//         emptyTitle={view === "suggestions" ? "No suggestions yet" : "No one matches your search"}
//         emptyHint={
//           view === "suggestions"
//             ? "Add interests and languages to your profile to get better suggestions."
//             : "Try removing a filter or searching for something different."
//         }
//       />
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { SwipeDeck } from "@/features/swipe/components/SwipeDeck";
import type { DiscoveryFilters } from "@/types/discovery";
import { FiltersPanel } from "../components/FiltersPanel";
import { UserGrid } from "../components/UserGrid";
import {
  EMPTY_FILTERS,
  FILTER_KEYS,
  buildParams,
  countActiveFilters,
  readFilters,
} from "../filters";
import { flattenPages, useDiscoverUsers, useSuggestions } from "../hooks";

type View = "swipe" | "explore" | "suggestions";

const TABS: { value: View; label: string }[] = [
  { value: "swipe", label: "Swipe" },
  { value: "explore", label: "Browse" },
  { value: "suggestions", label: "For you" },
];

const CHIP_LABELS: Record<string, string> = {
  gender: "Gender",
  min_age: "Min age",
  max_age: "Max age",
  country: "Country",
  state: "State",
  city: "City",
  language: "Language",
  interest: "Interest",
};

export function DiscoveryPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("view");
  const view: View = raw === "explore" || raw === "suggestions" ? raw : "swipe";

  const filters = useMemo(() => readFilters(params), [params]);
  const activeCount = countActiveFilters(filters);

  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState(filters.q);
  const debounced = useDebouncedValue(searchText, 400);

  const updateFilters = (patch: Partial<DiscoveryFilters>) =>
    setParams(buildParams({ ...filters, ...patch }, view), { replace: true });

  // Push the debounced search text into the URL.
  useEffect(() => {
    const q = debounced.trim();
    if (q !== filters.q) updateFilters({ q });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const explore = useDiscoverUsers(filters, view === "explore");
  const suggestions = useSuggestions(view === "suggestions");
  const active = view === "suggestions" ? suggestions : explore;

  const users = useMemo(() => flattenPages(active.data?.pages), [active.data]);
  const total = active.data?.pages[0]?.pagination.total;

  const clearAll = () => {
    setSearchText("");
    setParams(buildParams(EMPTY_FILTERS, view), { replace: true });
  };

  const chips = FILTER_KEYS.filter((k) => filters[k]).map((k) => ({
    key: k,
    label: `${CHIP_LABELS[k]}: ${filters[k]}`,
  }));

  return (
    <div className="space-y-5">
      {view !== "swipe" && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Discover</h2>
          <p className="text-sm text-muted-foreground">Find people who share your interests.</p>
        </div>
      )}

      <Tabs
        tabs={TABS}
        value={view}
        onChange={(v) => setParams(buildParams(filters, v), { replace: true })}
      />

      {view === "swipe" ? (
        <SwipeDeck />
      ) : (
        <>
          {view === "explore" && (
            <>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    maxLength={100}
                    placeholder="Search by name or username..."
                    className="h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowFilters((s) => !s)}>
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">
                      {activeCount}
                    </span>
                  )}
                </Button>
              </div>

              {showFilters && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                  <FiltersPanel
                    key={params.toString()}
                    filters={filters}
                    onApply={(patch) => {
                      updateFilters(patch);
                      setShowFilters(false);
                    }}
                    onClear={clearAll}
                  />
                </motion.div>
              )}

              {(chips.length > 0 || filters.online_only) && (
                <div className="flex flex-wrap items-center gap-2">
                  {chips.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => updateFilters({ [c.key]: "" } as Partial<DiscoveryFilters>)}
                      className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      {c.label} <X size={12} />
                    </button>
                  ))}
                  {filters.online_only && (
                    <button
                      onClick={() => updateFilters({ online_only: false })}
                      className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-2 text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      Online now <X size={12} />
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </>
          )}

          {total !== undefined && !active.isLoading && (
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "person" : "people"}{" "}
              {view === "suggestions" ? "suggested for you" : "found"}
            </p>
          )}

          <UserGrid
            users={users}
            isLoading={active.isLoading}
            isError={active.isError}
            error={active.error}
            isStale={active.isPlaceholderData}
            hasNext={!!active.hasNextPage}
            isFetchingNext={active.isFetchingNextPage}
            fetchNext={() => active.fetchNextPage()}
            onRetry={() => active.refetch()}
            emptyTitle={view === "suggestions" ? "No suggestions yet" : "No one matches your search"}
            emptyHint={
              view === "suggestions"
                ? "Add interests and languages to your profile to get better suggestions."
                : "Try removing a filter or searching for something different."
            }
          />
        </>
      )}
    </div>
  );
}