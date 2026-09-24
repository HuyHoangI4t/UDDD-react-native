import requests
from bs4 import BeautifulSoup

url = "https://www.ttn.edu.vn/libraries/tnu/tkbieusinhvien.php"

# Dựa theo quy luật các module Tnu của trường, payload gửi lên thường bao gồm mã sinh viên (msv) 
# và các tham số lọc học kỳ/năm học (tùy thuộc vào form trên trang web của trường)
payload = {
    'msv': '23103023',
    'dk': '10'
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.ttn.edu.vn/', # Thay bằng trang gốc chứa form xem TKB của trường
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest'
}

response = requests.post(url, data=payload, headers=headers)

if response.status_code == 200:
    print("=== LẤY THỜI KHÓA BIỂU THÀNH CÔNG ===\n")
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Tìm các bảng hiển thị thời khóa biểu trả về từ server
    tables = soup.find_all('table')
    print(f"Tìm thấy {len(tables)} bảng dữ liệu TKB.\n")
    
    for index, table in enumerate(tables):
        print(f"--- BẢNG THỨ {index + 1} ---")
        rows = table.find_all('tr')
        for row in rows:
            cols = [ele.text.strip() for ele in row.find_all(['td', 'th'])]
            if any(cols):
                print(" | ".join(cols))
        print("\n" + "="*40 + "\n")
else:
    print(f"Lỗi kết nối: {response.status_code}")
