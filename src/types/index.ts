export type UptimeCheckType = 'PING' | 'HTTPS';
export type ResponseStringType = 'CONTAINS' | 'NOT_CONTAINS';

export interface System {
    id: string;
    name: string;
    description: string;
}

export interface Component {
    id: string;
    name: string;
    description: string;
    systemId: string;
}

export interface UptimeCheck {
    id: string;
    name: string;
    systemId: string;
    componentId: string;
    checkDomainIp: string;
    checkType: UptimeCheckType;
    checkInterval: number;
    checkTimeout: number;
    requestHeaders?: string[];
    responseStringType?: ResponseStringType;
    responseStringValue?: string;
    downAlertDelay: number;
    downAlertResend: number;
    downAlertMessage?: string;
    alertEmail: string[];
}

export interface UptimeEvent {
    id: string;
    type: 'UP' | 'DOWN';
    system: string;
    component: string;
    startTime: string;
    endTime?: string;
    falsePositive: boolean;
    category?: 'INTERNAL' | 'EXTERNAL';
    note?: string;
    ticketCode?: string;
    maintenanceType?: 'PLANNED' | 'EMERGENCY';
}

export interface EventItem {
    id: string;
    timestampUtc: string;
    isUp: boolean;
    message: string;
    latencyMilliseconds: number;
    falsePositive: boolean;
    category: string;
    note: string;
    ticketId: string;
    maintenanceType: string;
}

export interface MonitorDetail {
    id: string;
    name: string;
    description: string;
    target: string;
    isUp?: boolean | null;
    groupId?: string | null;
    isActive: boolean;
    intervalInMinutes: number;
    uptime24hPercentage: string;
    uptime30dPercentage: string;
    lastEvents: EventItem[];
    lastImportantEvents: EventItem[];
}