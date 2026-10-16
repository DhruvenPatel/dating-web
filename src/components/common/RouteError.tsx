import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ErrorScreen } from "./ErrorScreen";

export function RouteError() {
  const error = useRouteError();
  console.error(error);

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  // After a new deploy, an open tab may fail to load an old page chunk;
  // a reload fetches the new version.
  return (
    <ErrorScreen title="This page failed to load" message={message}>
      <Button onClick={() => window.location.reload()}>Reload page</Button>
      <Button variant="outline" onClick={() => window.location.assign("/")}>
        Go home
      </Button>
    </ErrorScreen>
  );
}