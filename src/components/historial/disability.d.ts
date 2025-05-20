interface DisabilityProps {
    id: string;
    userId: string;
    username?: string;
    email?: string;
    type: string;
    startDate: string;
    endDate: string;
    observations: string;
    status: string;
    files?: Record<string, string>;
  }
  