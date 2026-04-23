import { Metadata } from "next";
import { HistoryPage } from "@/components/history/history-page";

export const metadata: Metadata = {
  title: "Emergency History | Smart Triage AI",
  description: "View past emergency records and triage assessments",
};

export default function History() {
  return <HistoryPage />;
}
