export interface DefectPrediction {
  defect_type: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface DefectResponse {
  defects: {
    defects_found: boolean;
    predictions: DefectPrediction[];
  };
  result_image_url?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: Date;
  filename: string;
  defects_found: boolean;
  defect_count: number;
  original_image: string;
  result_image?: string;
  predictions: DefectPrediction[];
}

export interface DefectTypeConfig {
  name: string;
  color: string;
  icon: string;
  translationKey: string;
}

export const DEFECT_TYPES: Record<string, DefectTypeConfig> = {
  missing_hole: {
    name: 'missing_hole',
    color: 'text-red-500',
    icon: '○',
    translationKey: 'defectTypes.missing_hole'
  },
  mouse_bite: {
    name: 'mouse_bite', 
    color: 'text-green-500',
    icon: '🐛',
    translationKey: 'defectTypes.mouse_bite'
  },
  open_circuit: {
    name: 'open_circuit',
    color: 'text-blue-500',
    icon: '⏻',
    translationKey: 'defectTypes.open_circuit'
  },
  short_circuit: {
    name: 'short_circuit',
    color: 'text-orange-500',
    icon: '⚡',
    translationKey: 'defectTypes.short_circuit'
  },
  spur: {
    name: 'spur',
    color: 'text-purple-500',
    icon: '🔀',
    translationKey: 'defectTypes.spur'
  },
  spurious_copper: {
    name: 'spurious_copper',
    color: 'text-teal-500',
    icon: '📊',
    translationKey: 'defectTypes.spurious_copper'
  }
};