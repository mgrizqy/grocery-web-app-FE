// types/global.d.ts
export {};

declare global {
    interface Window {
        google: any;
        handleCallbackResponse: (response: any) => void;
    }
}
