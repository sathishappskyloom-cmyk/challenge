import * as XLSX from "xlsx";
import { Challenge } from "../types/Challenge";

export function loadExcelFromAssets(filename: string): Promise<any[][]> {
  return new Promise((resolve) => {
    const assetPath = `/${filename}`;

    fetch(assetPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${filename}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData as any[][]);
      })
      .catch((error) => {
        console.error(`Error loading Excel file ${filename}:`, error);
        // Fallback to generated sample data if file loading fails
        resolve(
          generateSampleExcelData({
            id: "fallback",
            title: "Sample Data",
            startDate: new Date().toISOString().split("T")[0],
            totalDays: 30,
          } as Challenge)
        );
      });
  });
}

export function exportToExcel(data: any[][], filename: string) {
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Challenge Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToCSV(data: any[][], filename: string) {
  const csv = data
    .map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function generateSampleExcelData(challenge: Challenge): any[][] {
  const sampleData = [["Day", "Date", "Completed", "Notes", "Status"]];

  const startDate = new Date(challenge.startDate);

  for (let i = 0; i < challenge.totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];
    const completed = i < 3 ? "✅" : "";
    const status = i < 3 ? "✅" : "⏳";

    sampleData.push([
      i + 1,
      dateStr,
      completed,
      i < 3 ? "Completed successfully" : "",
      status,
    ]);
  }

  return sampleData;
}
