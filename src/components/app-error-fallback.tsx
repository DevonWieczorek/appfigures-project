import { StatePanel } from "@/components/state-panel";

export const AppErrorFallback = () => (
  <main className="container mx-auto p-4">
    <StatePanel id="app-render-error" innerClassName="py-4 text-center error">
      <h3>It's not you, it's us.</h3>
      There was an unexpected error loading this page. Please refresh and try again.
    </StatePanel>
  </main>
);
