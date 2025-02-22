export interface Revenue {
  period: string;
  revenue: number;
  month: string;
  year: number;
}

export interface RevenueData {
  data: Array<Revenue>;
}

export interface ManagementStats {
  stats: {
    totalAppointments: number;
    medianAge: number;
    totalRevenue: number;
    activePatients: number;
    appointmentCompletionRate: number;
  };
  ageDistribution: Array<{
    name: string;
    value: number;
  }>;
}
