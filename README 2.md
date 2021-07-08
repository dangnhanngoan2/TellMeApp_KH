# TellMe_ReactNative

#Setup project

- Repo: git clone https://#uername@bitbucket.org/itleadpro/tellme_reactnative.git

### copy file for node_modules

`./scripts/post-install.sh`

# Install and run app

- npm install or yarn.
- cd ios and pod install or pos update.
- yarn i6, yarn x, yarn i5s for iphone 6, iphone X, iphone 5s.
- yarn a for "react-native run-android"

# feature

- Cho quyét 5 phút, 2 phút cuối cho đếm ngược\*: done: done
- Chát có thể gửi ảnh ...\*\*: done: done
- thay text" " 5 phút tìm kiếm bắt đầu nếu không chọn được ai vui lòng đặt lại dịch vụ." : done
- Cho KH hẹn có kế hoạch ngay trong now+2 phút: done
- KH có thể đặt ngay khi đang chờ load nhân viên\*\*\*: done:done
- Thêm trường nhập mã nhà cung cấp: done

* khi quyét nhân viên bán kinh < 30km\*\*\*
* Hiển thị danh sách nhân viên ở Map nhỏ

# new feature

1. Khi KH và NV chát bỏ chuông đi. Mình lại báo chuông cho chính mình. Cho phép ấn back lại trên máy thay vì phải ấn back trên app. Dùng cả hai song song. Sever. (Done)
2. Khi nv và kH booking thành công thì báo trên máy KH là " chờ Nvien di chuyển, hãy chát với nvien để biết lộ trình" khi đã bắt đầu cuộc hẹn thì màn hình của KH báo là bạn đang trong cuộc hẹn với ( tên nvien).Thay hết mã kh,nv bằng tên user cho gần gũi trên app.(Done)
3. Thay biểu tượng của nvien trong bản đồ khi booking thành công. (Đỏ thành xanh) (Done)
4. Chỉnh lại phần dky nghành nghề của nvien. Cho nvien chọn nghành nghề và điều chỉnh nghành nghề trong tài khoản cá nhân. Làm sao cho nvien và KH đky đơn giản hơn hiện nay. Để mã đại lý ngay sau phần tên user. Có hộp nhập mã luôn k cần ấn vào mới hiện hộp như hiện nay. Cho phép các thông tin đại lý( sdt, email) được phép trùng với user. (Done)
5. khi booking thanh công cho kh và nvien hien thị booking luôn và dễ dàng.- giải pháp. Nút hủy, nút kéo lên xuống,tô đậm rõ như grab. (Done)
6. Đại lý chỉ nhận lợi nhuận tiền mặt bằng với lợi nhuận của Tim. Fix luôn.
7. Cho phép user và đại lý có trùng email và sdt.
   Cho KH đăng ký tk qua 2 cách
   Qua zalo sau cho nhập thêm email, mã đại lý. Hoặc thủ công như hiện nay. Để tránh tối đa lỗi OTP.

# build android
./scripts/post-install.sh && npx jetifier && cd android && ./gradlew clean && ./gradlew assembleRelease && cd ..

# codePush
1. IOS
appcenter codepush release-react -a ngon.dat97/TellmeKH-IOS -d Production
2. ANDROID
appcenter codepush release-react -a ngon.dat97/TellmeKH-ANDROID -d Production