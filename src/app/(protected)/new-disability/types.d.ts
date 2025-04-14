interface FormData {
  type: string;
  startDate: string;
  endDate: string;
  observations: string;
  disabilityPDF: FileList;
  furipsPDF?: FileList;
  medicalCertPDF?: FileList;
  birthCertPDF?: FileList;
  liveBirthCertPDF?: FileList;
  motherIdPDF?: FileList;
}