# Hướng Dẫn Cài Đặt & Sử Dụng (Setup Guide)

Chào mừng bạn đến với dự án **Smart Campus**. Tài liệu này hướng dẫn các bước cơ bản để thiết lập môi trường phát triển và chạy ứng dụng.

## 1. Yêu Cầu Hệ Thống (Prerequisites)

Để làm việc với dự án này, hãy đảm bảo bạn đã cài đặt các công cụ sau:

- **Node.js**: Phiên bản LTS mới nhất (Khuyên dùng [nvm](https://github.com/nvm-sh/nvm) để quản lý phiên bản Node).
- **npm** (thường đi kèm với Node.js) hoặc **yarn**.
- **Expo Go**: Tải ứng dụng Expo Go trên điện thoại (iOS hoặc Android) để xem ứng dụng trực tiếp.
- **Git**: Để quản lý phiên bản mã nguồn.

## 2. Cài Đặt (Installation)

1. **Clone dự án**:
   ```bash
   git clone <đường-dẫn-repo>
   cd ltdddnt
   ```

2. **Cài đặt các thư viện phụ thuộc**:
   Tất cả các thư viện cần thiết đã được định nghĩa trong file `package.json`. Bạn chỉ cần chạy lệnh sau để cài đặt toàn bộ:
   ```bash
   npm install
   # Hoặc nếu bạn sử dụng yarn
   yarn install
   ```

### Các Thư Viện Chính (Dependencies)
Dưới đây là một số thư viện quan trọng được sử dụng trong dự án:
- `expo`: Framework nền tảng.
- `expo-router`: Điều hướng trong ứng dụng.
- `react-native`: Thư viện giao diện chính.
- `expo-linear-gradient`: Tạo hiệu ứng màu chuyển tiếp (gradient).
- `@expo/vector-icons`: Bộ icon cho ứng dụng.
- `react-native-safe-area-context`: Xử lý vùng an toàn (safe area) trên các thiết bị có notch.

*(Để xem danh sách đầy đủ và phiên bản cụ thể, vui lòng kiểm tra file `package.json` trong thư mục gốc).*

## 3. Chạy Dự Án (Running the App)

Sau khi cài đặt xong, bạn có thể khởi chạy môi trường phát triển:

```bash
npx expo start
```

Sau khi lệnh chạy thành công, bạn sẽ thấy mã QR trên terminal. Hãy dùng ứng dụng **Expo Go** trên điện thoại để quét mã QR và kết nối với máy chủ phát triển.

