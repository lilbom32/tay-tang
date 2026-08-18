// Schema chung cho nội dung 1 tuyến tour. Thêm tuyến mới = thêm thư mục
// content/tours/<slug>/ theo đúng shape này — không cần sửa code UI.

export type TouchpointType = "normal" | "risk" | "mot";

export type Actor = "HDV-VN" | "HDV-TD" | "OPS" | "KHACH";

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface ScriptSection {
  id: string;
  heading: string;
  timing?: string;
  body: string[]; // đoạn văn, giữ nguyên xuống dòng như bản gốc
  action?: string; // hướng dẫn hành động đi kèm (không phải lời thoại)
}

export interface Touchpoint {
  id: string;
  time: string;
  title: string;
  location: string;
  actor: Actor;
  type: TouchpointType;
  standard: string; // tiêu chuẩn cần đạt
  risk?: string; // rủi ro nếu làm sai
  scriptRef?: string; // id của ScriptSection liên quan, nếu có
}

export interface DayContent {
  day: number;
  slug: string;
  title: string;
  route: string; // ví dụ "TP.HCM → Thành Đô → Lhasa"
  theme: string;
  emotion: string;
  altitudeAvg: string;
  knowledgeLayer: string;
  mission: string; // bối cảnh & nhiệm vụ thuyết minh
  touchpoints: Touchpoint[];
  scripts: ScriptSection[];
  checklist: ChecklistItem[];
}

export interface TourMeta {
  slug: string;
  name: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  days: number;
  route: string;
  highestAltitude: string;
}

export interface GoldenRule {
  id: number;
  text: string;
}
