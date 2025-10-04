#!/usr/bin/env python

from dotenv import load_dotenv
import os
import pandas as pd
from supabase import create_client, Client

load_dotenv(dotenv_path='c:\\Users\\LocalUser\\Desktop\\petal\\.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Path to your downloaded CSV file
CSV_FILE_PATH = "c:/Users/LocalUser/Desktop/petal/assets/MOD_NDVI_M_2025-05-01_rgb_1440x720.SS.CSV"

def import_ndvi_data(csv_file_path: str):
    print(f"Starting import for {csv_file_path}")

    df = pd.read_csv(csv_file_path)
    df_long = df.rename(columns={'system:index': 'id'})
    if '.geo' in df_long.columns:
        df_long = df_long.drop(columns=['.geo'])
    df_long['latitude'] = pd.to_numeric(df_long['latitude'])
    df_long['longitude'] = pd.to_numeric(df_long['longitude'])
    df_long['ndvi_value'] = pd.to_numeric(df_long['ndvi_value'], errors='coerce')
    df_long['measurement_date'] = pd.to_datetime(df_long['measurement_date'])
    df_long['measurement_date'] = df_long['measurement_date'].apply(lambda x: x.isoformat())

    df_long['geo'] = df_long.apply(lambda row: f"POINT({row.longitude} {row.latitude})", axis=1)

    df_long = df_long[df_long['ndvi_value'] != 99999.0]
    df_long = df_long.dropna(subset=['ndvi_value'])

    data_to_insert = df_long.drop(columns=['id'], errors='ignore').to_dict(orient='records')

    print(f"Prepared {len(data_to_insert)} records for insertion.")

    chunk_size = 1000
    for i in range(0, len(data_to_insert), chunk_size):
        chunk = data_to_insert[i:i + chunk_size]
        print(f"Inserting chunk {int(i/chunk_size) + 1}/ {int(len(data_to_insert)/chunk_size) + 1}...")
        try:
            response = supabase.table("ndvi_data").insert(chunk).execute()
            print(f"Successfully inserted {len(response.data)} records.")
        except Exception as e:
            print(f"An unexpected error occurred during insertion: {e}")

    print("NDVI data import complete.")

if __name__ == "__main__":
    import_ndvi_data(CSV_FILE_PATH)