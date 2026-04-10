/**
 * Utility functions for downloading claim files in EDI and PDF formats
 */

export const downloadClaimEDI = (claimId: string, patientName: string, amount?: number) => {
  // Generate mock EDI 837 format (healthcare claim standard)
  const ediContent = `ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *210410*1200*U*00401*000000001*0*P*:~
GS*HC*SENDER*RECEIVER*20210410*120000*1*X*004010X098A1~
ST*837*0001*005010X222A1~
BHT*0019*00*${claimId}*20210410*1200*CH~
NM1*IL*1*${patientName}*~
NM1*PR*2*INSURANCE CO*~
CLM*${claimId}*${amount || 1000}***11:B:1*12*B*1*11*B~
SE*10*0001~
GE*1*1~
IEA*1*000000001~`;

  const element = document.createElement("a");
  const file = new Blob([ediContent], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = `${claimId}_claim.edi`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadClaimPDF = (claimId: string, patientName: string, amount?: number, status?: string) => {
  // Generate mock PDF content using HTML canvas conversion
  const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 600 >>
stream
BT
/F1 24 Tf
50 750 Td
(CLAIM REPORT) Tj
0 -40 Td
/F1 12 Tf
(========================================) Tj
0 -20 Td
(Claim ID: ${claimId}) Tj
0 -20 Td
(Patient Name: ${patientName}) Tj
0 -20 Td
(Amount: $${(amount || 1000).toLocaleString()}) Tj
0 -20 Td
(Status: ${status || "Pending"}) Tj
0 -20 Td
(Date: ${new Date().toLocaleDateString()}) Tj
0 -40 Td
(========================================) Tj
0 -20 Td
(This is an automatically generated claim report.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000333 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1034
%%EOF`;

  const element = document.createElement("a");
  const file = new Blob([pdfContent], { type: "application/pdf" });
  element.href = URL.createObjectURL(file);
  element.download = `${claimId}_claim.pdf`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
