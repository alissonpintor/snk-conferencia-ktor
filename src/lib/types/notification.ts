export type Notification = {
    title: string;
    message: string;
    timer?: number;
    type?: "success" | "error" | "warning" | "info"
};

export type Action = {
    text: string;
    action: () => void;
};