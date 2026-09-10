# Product Price Clustering (K-means)

วิเคราะห์และจัดกลุ่มสินค้าตามราคา โดยดึงข้อมูลจาก REST API ของโปรเจกต์นี้
(`http://119.59.102.161:3034/api/products`)

## ไฟล์ในโฟลเดอร์นี้

| ไฟล์ | หน้าที่ |
|---|---|
| `elbow_method.py` | หาค่า k (จำนวนกลุ่ม) ที่เหมาะสม โดย plot กราฟ inertia เทียบกับ k → เซฟเป็น `elbow_plot.png` |
| `clustering.py` | จัดกลุ่มสินค้าจริงด้วย KMeans (k=3: budget/mid-range/premium) → print ตาราง และเซฟ `cluster_results.csv` |
| `requirements.txt` | รายชื่อ Python library ที่ต้องใช้ |

## วิธีรันบน VPS (Linux)

1. เข้าไปที่โฟลเดอร์นี้
   ```bash
   cd analysis
   ```

2. สร้างและเปิดใช้ virtual environment (แนะนำ กันชนกับ package อื่นบนเครื่อง)
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. ติดตั้ง dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. **รัน elbow method ก่อนเสมอ** เพื่อดูกราฟหาค่า k ที่เหมาะสม
   ```bash
   python3 elbow_method.py
   ```
   - ผลลัพธ์: ไฟล์ `elbow_plot.png` — โหลดไฟล์นี้กลับมาดูบนเครื่องตัวเอง เช่น
     `scp user@vps:/path/to/analysis/elbow_plot.png .`
   - ดูจุด "หักศอก" (elbow) ของกราฟ ถ้าจุดนั้นไม่ใช่ k=3 ให้แก้ค่า
     `N_CLUSTERS` ใน `clustering.py` ให้ตรงกับ k ที่เหมาะสมก่อนรันขั้นต่อไป

5. รัน clustering จริง
   ```bash
   python3 clustering.py
   ```
   - ผลลัพธ์: print ตาราง `item_name / price / cluster / cluster_label` ออกทาง terminal
     พร้อมสรุปค่าเฉลี่ยราคาต่อกลุ่ม และเซฟไฟล์ `cluster_results.csv`

6. ปิด virtual environment เมื่อใช้เสร็จ
   ```bash
   deactivate
   ```

## หมายเหตุ

- API endpoint ถูก hardcode ไว้ในตัวแปร `API_URL` ที่ต้นไฟล์ทั้งสอง ถ้า endpoint เปลี่ยนให้แก้ตรงนั้น
- สินค้าที่ `price` เป็นค่าว่าง/ไม่ใช่ตัวเลขจะถูกตัดออกก่อนเข้าโมเดลอัตโนมัติ
