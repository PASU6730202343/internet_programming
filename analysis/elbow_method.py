"""
Elbow method หาจำนวน cluster (k) ที่เหมาะสมสำหรับจัดกลุ่มสินค้าตามราคา
รันไฟล์นี้ก่อน clustering.py เสมอ เพื่อดูกราฟแล้วยืนยันว่า k=3 เหมาะสมจริงหรือไม่
"""

import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import matplotlib

matplotlib.use("Agg")  # ไม่มีหน้าจอบน VPS ต้อง render เป็นไฟล์แทนการ show()

import matplotlib.pyplot as plt
import pandas as pd
import requests
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

API_URL = "http://119.59.102.161:3034/api/products"
MAX_K = 9


def fetch_products() -> pd.DataFrame:
    response = requests.get(API_URL, timeout=10)
    response.raise_for_status()
    df = pd.DataFrame(response.json())

    if "price" not in df.columns:
        raise ValueError("API response ไม่มีคอลัมน์ 'price'")

    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["price"]).reset_index(drop=True)
    return df


def compute_inertias(df: pd.DataFrame, max_k: int = MAX_K) -> list[float]:
    scaler = StandardScaler()
    scaled_price = scaler.fit_transform(df[["price"]])

    inertias = []
    for k in range(1, max_k + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(scaled_price)
        inertias.append(kmeans.inertia_)
        print(f"k={k}: inertia={kmeans.inertia_:.4f}")

    return inertias


def main():
    print(f"กำลังดึงข้อมูลจาก {API_URL} ...")
    df = fetch_products()
    print(f"ได้สินค้าทั้งหมด {len(df)} รายการ\n")

    inertias = compute_inertias(df)

    plt.figure(figsize=(8, 5))
    plt.plot(range(1, MAX_K + 1), inertias, marker="o")
    plt.title("Elbow Method - Finding Optimal k")
    plt.xlabel("Number of clusters (k)")
    plt.ylabel("Inertia")
    plt.xticks(range(1, MAX_K + 1))
    plt.grid(True)

    output_path = "elbow_plot.png"
    plt.savefig(output_path)
    print(f"\nบันทึกกราฟไปที่ {output_path}")


if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.RequestException as exc:
        print(f"เรียก API ไม่สำเร็จ: {exc}", file=sys.stderr)
        sys.exit(1)
