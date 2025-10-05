import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();

  const { data: ndviData, error } = await supabase
    .from("ndvi_data")
    .select("measurement_date, ndvi_value")
    .order("measurement_date", { ascending: true });

  if (error) {
    console.error("Error fetching NDVI data:", error);
    return NextResponse.json({ error: "Failed to fetch NDVI data" }, { status: 500 });
  }

  if (!ndviData || ndviData.length === 0) {
    return NextResponse.json({ error: "No NDVI data available" }, { status: 404 });
  }

  const historicalData = ndviData.map(item => ({
    date: item.measurement_date,
    intensity: item.ndvi_value
  }));

  return NextResponse.json({ data: historicalData });
}
