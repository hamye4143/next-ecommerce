import {SessionChart, SessionDTO} from "@/interface/GAResponse";

export interface GARealTimeResponse {
  recentVisitors: Array<SessionDTO<number>>;
  activeVisitors: Array<SessionDTO<number>>;
  activeVisitChart: SessionChart;
  events: Array<SessionDTO<number>>;
  devices: Array<SessionDTO<number>>;
}

export interface GARealTimeResponseTop {
  activeVisitors: Array<SessionDTO<number>>;
  events: Array<SessionDTO<number>>;
  activeVisitChart: SessionChart;
}

export interface GARealTimeResponseBottom {
  recentVisitors: Array<SessionDTO<number>>;
  devices: Array<SessionDTO<number>>;
}

