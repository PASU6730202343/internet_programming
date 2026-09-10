"""
K-means clustering ของสินค้าตามราคา (budget / mid-range / premium)
ดึงข้อมูลจาก REST API ของโปรเจกต์นี้แล้วจัดกลุ่มด้วย scikit-learn
"""

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import pandas as pd
import requests
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

API_URL = "http://119.59.102.161:3034/api/products"
N_CLUSTERS = 3
CLUSTER_LABELS = ["budget", "mid-range", "premium"]


def fetch_products() -> pd.DataFrame:
    response = requests.get(API_URL, timeout=10)
    response.raise_for_status()
    df = pd.DataFrame(response.json())

    if "price" not in df.columns:
        raise ValueError("API response ไม่มีคอลัมน์ 'price'")

    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    before = len(df)
    df = df.dropna(subset=["price"]).reset_index(drop=True)
    dropped = before - len(df)
    if dropped:
        print(f"ตัดสินค้าที่ price ไม่ถูกต้อง/ว่างออก {dropped} รายการ")

    return df


def cluster_by_price(df: pd.DataFrame, n_clusters: int = N_CLUSTERS) -> pd.DataFrame:
    scaler = StandardScaler()
    scaled_price = scaler.fit_transform(df[["price"]])

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df["cluster"] = kmeans.fit_predict(scaled_price)

    # cluster number ที่ KMeans ให้มาไม่เรียงตามราคาเสมอไป
    # จึงต้อง rank ตาม mean price ก่อน map เป็นชื่อกลุ่มที่อ่านง่าย
    cluster_order = (
        df.groupby("cluster")["price"].mean().sort_values().index.tolist()
    )
    label_map = {
        cluster_id: CLUSTER_LABELS[rank]
        for rank, cluster_id in enumerate(cluster_order)
    }
    df["cluster_label"] = df["cluster"].map(label_map)

    return df


def main():
    print(f"กำลังดึงข้อมูลจาก {API_URL} ...")
    df = fetch_products()
    print(f"ได้สินค้าทั้งหมด {len(df)} รายการ\n")

    df = cluster_by_price(df)

    result_columns = ["item_name", "price", "cluster", "cluster_label"]
    result = df[result_columns].sort_values("price").reset_index(drop=True)

    print(result.to_string(index=False))

    print("\nสรุปแต่ละกลุ่ม:")
    summary = df.groupby("cluster_label")["price"].agg(["count", "mean", "min", "max"])
    summary = summary.reindex(CLUSTER_LABELS).dropna()
    print(summary.to_string())

    output_path = "cluster_results.csv"
    df[result_columns].to_csv(output_path, index=False)
    print(f"\nบันทึกผลลัพธ์ไปที่ {output_path}")


if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.RequestException as exc:
        print(f"เรียก API ไม่สำเร็จ: {exc}", file=sys.stderr)
        sys.exit(1)
