import React from "react";
import { Alert } from "./Alert";
import Button from "./Button";

const FallbackPage = () => {
  return (
    <main className="fallback-page">
      <h1>Uh Oh</h1>
      <Alert
        type="error"
        heading={<h2>Unexpected Error</h2>}
        description="Something went wrong"
        actions={
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        }
      />
    </main>
  );
};

export default FallbackPage;
