// global.d.ts
interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request?: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
  