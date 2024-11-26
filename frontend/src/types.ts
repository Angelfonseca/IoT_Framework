// types.ts
export interface Condition {
    condition: "<" | "<=" | "=" | ">=" | ">";
    threshold: number;
}

export interface Filter {
    field: string;
    conditions: Condition[];
    device: string;
    module: string;
}

export interface Alert {
    description: string;
    device: string;
    module: string;
    resolved: boolean;
    seen: boolean;
}
