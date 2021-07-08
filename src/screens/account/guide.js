import React, { Component } from "react";
import { StyleSheet, Linking, Dimensions } from "react-native";
import { ComponentLayout } from "../../components/common/component-layout";
import { connect } from "react-redux";
import { Colors, I18n } from "tell-me-common";
import { Text } from "../../components/common/text";
import { Image } from "../../components/common/image";
import { ScrollableComponent } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
const { height, width } = Dimensions.get("window");

export class Guide extends Component {
  render() {
    return (
      <ComponentLayout
        headerText={I18n.t("accounts.guide.title")}
        rightHasNoti
        navigation={this.props.navigation}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.titleText}>
            Giới thiệu{" "}
            <Text style={{ color: Colors.BLUE_TEXT_LINK }}>Tellme</Text>
          </Text>
          <Text style={styles.detailText}>
            Ứng dụng TellMe do công ty cổ phần quốc tế Vinatell phát triển là
            nền tảng công nghệ hoạt động trong lĩnh vực nhân sự Escort và
            Freelancer thông qua Nghề lắng nghe(
            <Text
              onPress={() => Linking.openURL("https://nghelangnghe.vn/")}
              numberOfLines={2}
              style={[styles.textpolicy, { textDecorationLine: "underline" }]}
            >
              nghelangnghe.vn
            </Text>
            ). Tại đây các nhân viên được các chuyên gia đào tạo kỹ năng giao
            tiếp ứng xử và lắng nghe để làm nhiệm vụ giúp doanh nghiệp xúc tiến
            đối ngoại đem lại lợi ích to lớn về giá trị phát triển bản thân và
            kinh tế cho các cá nhân tham gia. Thêm thu nhập thụ động cho các
            nhân viên đang trong độ tuổi lao động tạo cơ hội chia sẻ các cơ hội
            kinh doanh cũng như kinh nghiệm của những người thành công cho thế
            hệ trẻ. Nơi KH lựa chọn những ứng viên phù hợp cho chiến lược nhân
            sự của tổ chức mình, hợp tác bán chéo các sản phẩm dịch vụ của đơn
            vị mình thông qua dịch vụ: cafe, Ẩm thực, Âm nhạc, trợ lý.
          </Text>
          <Text style={styles.detailText}>
            TellMe hoạt động dựa trên luật pháp, văn hóa truyền thống Việt Nam.
            Nghiêm cấm các hành vi mại dâm và các hoạt động trái pháp luật theo
            các điều khoản trong bản đăng ký thành viên. Tất cả các nhân viên đủ
            tiêu chuẩn về trình độ, ngoại hình, hồ sơ, hợp đồng và chứng nhận về
            kỹ năng được đào tạo mới đủ điều kiện được duyệt và cộng tác làm
            việc cho nền tảng ứng dụng. Các khách hàng doanh nghiệp, giới đầu
            tư, khách nước ngoài tại Việt Nam là những người phù hợp nhất để sử
            dụng ứng dụng.
          </Text>
          <FastImage
            style={{
              width: 0.8 * width,
              height: 200,
              marginLeft: 0.1 * width - 10,
            }}
            source={require("../../assets/tellme-guide.png")}
          />
          <Text style={styles.detailText}>
            Vinatell cung cấp nền tảng công nghệ TellMe cho các tổ chức đẳng cấp
            có cùng nhóm khách hàng mục tiêu và các cty nhân sự trên toàn quốc
            giúp họ tự xây dựng, tổ chức, quản lý, vận hành cho các cá nhân
            trong hệ sinh thái thương hiệu của họ quản lý hoàn toàn bằng công
            nghệ, tài khoản riêng thông qua mã đại lý. TellMe chia sẻ đều chức
            năng quản lý và lợi ích kinh tế cho các đại lý và đối tác của mình
            trong nền kinh tế chia sẻ trực tuyến công nghệ 4.0 được nhà nước
            Việt Nam quan tâm và thúc đẩy. Với tham vọng xây dựng TellMe trở
            thành hệ sinh thái sạch, với lượng người dùng chọn lọc có điều kiện,
            tạo môi trường hợp tác chia sẻ kinh tế linh hoạt thông minh đem lại
            lợi ích toàn diện cho các bên liên quan, góp phần thúc đẩy kinh tế
            và GDP Việt Nam. Nhắc cho Thế giới rằng Việt Nam có thể làm được
            những gì.
          </Text>
          <Text style={styles.titleText}>Hướng dẫn sử dụng</Text>
          <Text
            style={[styles.detailText, { fontSize: 15, fontWeight: "600" }]}
          >
            Đặt lịch ngay
          </Text>
          <Text style={styles.detailText}>
            Khách hàng có thể tiến hành đặt lịch ngay tại thời điểm hiện tại của
            khách hàng để bắt đầu buổi hẹn với nhân viên phù hợp
          </Text>
          <FastImage
            style={styles.image}
            source={require("../../assets/guide-home.jpg")}
          />
          <Text style={styles.detailText}>Để bắt đầu buổi hẹn : </Text>
          <Text style={styles.text}>
            - Chọn dịch vụ mà khách hàng muốn : Cafe, Ẩm thực, Âm nhạc, Trợ lý
          </Text>
          <Text style={styles.text}>
            - Thời lượng diễn ra buổi hẹn : 1 giờ, 2 giờ, 3 giờ và 4 giờ ( đối
            với các dịch vụ Ẩm thực, Âm nhạc, Trợ lý thời gian tối thiểu để bắt
            đầu cuộc hẹn sẽ là 2 giờ)
          </Text>
          <Text style={styles.text}>
            - Đối tượng : Khách hàng sẽ chọn 1 trong 2 đối tượng là Nam hoặc Nữ
          </Text>
          <Text style={styles.text}>
            - Địa chỉ : Chúng tôi sẽ mặc định địa chỉ hiện tại của khách hàng là
            điểm hẹn cho đến khi khách hàng tự nhập địa chỉ điểm hẹn trên ô địa
            chỉ. Để dễ dàng cho việc theo dõi vị trí của mình, bạn cũng có thể
            nhìn vị trí của mình trên Map
          </Text>
          <Text style={styles.text}>
            - Để chọn được nhân viên sẵn sàng bạn cần click nút “ Đặt ngay” sau
            khi chọn đầy đủ thông tin
          </Text>
          <Text style={styles.text}>
            - Lưu ý : Đối với Khách Hàng lần đầu sử dụng dịch vụ cần chuyển
            khoản cho TellMe tối thiểu 500k, danh sách tài khoản sẽ được hiện
            đầy đủ trong phần thanh toán
          </Text>
          <Text style={styles.detailText}>Chờ nhân viên phù hợp :</Text>
          <FastImage
            style={styles.image}
            source={require("../../assets/guide-load-employee.jpg")}
          />
          <Text style={styles.text}>
            - Sau khi chọn đầy đủ thông tin, chúng tôi sẽ tìm kiếm nhân viên sẵn
            sàng và phù hợp nhất với bạn
          </Text>
          <Text style={styles.text}>
            - Bạn vui lòng chờ tối đa 2 phút để tải được những nhân viên phù hợp
            với tiêu chí bạn đưa ra
          </Text>
          <Text style={styles.text}>
            - Đồng thời bạn cũng có tối đa 2 phút để chọn những nhân viên đã
            được sẵn sàng. Nếu bạn không chọn nhân viên nào hoặc đã quá 2 phút
            bạn chưa chọn được ai thì chúng tôi sẽ coi như booking đó thất bại
            và bạn vui lòng chọn lại các tiêu chí tại màn Homepage để bắt đầu
            lại cuộc hẹn
          </Text>
          <Text style={styles.text}>
            - Để đặt được lịch hẹn thành công thì bạn cần chọn nhân viên ( tối
            thiểu 1 nhân viên) và chọn phương thức thanh toán
          </Text>
          <Text style={styles.text}>
            - Chúng tôi đưa ra 2 phương thức thanh toán dành cho bạn, số tiền
            trên các phương thức sẽ được tự động cập nhập dựa theo loại hình
            dịch vụ, số người và thời lượng thời gian mà bạn chọn
          </Text>
          <Text style={styles.textChildren}>
            + Phương thức thanh toán bằng tim : Bạn chuyển khoản qua tài khoản
            của chúng tôi và chúng tôi sẽ nạp tim vào tài khoản cho bạn
          </Text>
          <Text style={styles.textChildren}>
            + Phương thức thanh toán bằng tiền mặt : Bạn không cần nạp tiền vào
            tài khoản, tuy nhiên khi kết thúc buổi hẹn bạn vui lòng thanh toán
            toàn bộ chi phí cho nhân viên
          </Text>

          <Text style={styles.detailText}>Đặt lịch thành công : </Text>
          <FastImage
            style={styles.image}
            source={require("../../assets/guide-map.jpg")}
          />
          <Text style={styles.text}>
            - Sau khi đặt lịch thanh toán thành công, hệ thống sẽ chuyển sang
            màn Map để cho thấy vị trí của nhân viên so với khách hàng.
          </Text>
          <Text style={styles.text}>
            - Tại đây khách hàng có thể nhắn tin cho cho nhân viên hoặc có thể
            hủy booking, khách hàng chỉ được hủy booking trước khi Nhân viên bắt
            đầu buổi hẹn, và nếu khách hàng hủy booking thì sẽ bị phạt 30% giá
            trị booking. Mọi giao dịch sẽ được ghi nhận tại phần Ví TellMe của
            người dùng
          </Text>
          <Text
            style={[styles.detailText, { fontSize: 15, fontWeight: "600" }]}
          >
            Đặt lịch có kế hoạch
          </Text>
          <Text style={styles.detailText}>
            Khách hàng cũng có thể đặt lịch lại những Nhân viên mà mình đã từng
            sử dụng dịch vụ thông qua đặt lịch có kế hoạch. Mọi thao tác và
            chính sách đều giống khi đặt lịch ngay tuy nhiên khách hàng có thể
            chủ động về thời gian và địa điểm
          </Text>
          <FastImage
            style={styles.image}
            source={require("../../assets/Picture4.png")}
          />
          <Text
            style={[styles.detailText, { fontSize: 15, fontWeight: "600" }]}
          >
            Kết thúc sớm cuộc hẹn
          </Text>
          <Text style={styles.detailText}>
            Khách hàng đã đặt lịch hẹn với Nhân viên nhưng vì 1 lý do nào đó bạn
            bận không thể ngồi đến hết giờ để chia sẻ với Nhân viên thì hãy vào
            danh sách hoạt động, tìm đúng booking đang diễn ra và click vào nút
            “ Kết thúc”.Nếu bạn click “OK” thì khi đó buổi hẹn sẽ được kết thúc
            sớm. Đừng quên hãy rating cho Nhân viên và Vote sao để TellMe nâng
            cao chất lượng buổi hẹn của bạn nhé!
          </Text>
          <FastImage
            style={styles.image}
            source={require("../../assets/guide-image.png")}
          />

          <Text
            style={[
              {
                textAlign: "right",
                marginTop: 15,
                fontWeight: "600",
                fontSize: 15,
              },
            ]}
          >
            Chúc bạn mạnh khoẻ, thành đạt
          </Text>
          <Text
            style={[
              {
                textAlign: "right",
                marginTop: 4,
                fontWeight: "600",
                fontSize: 15,
              },
            ]}
          >
            - CEO TellMe -
          </Text>
        </ScrollView>
      </ComponentLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    //alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
    paddingBottom: 20,
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  titleText: {
    //color: Colors.GREEN,
    fontSize: 20,
    paddingVertical: 10,
    paddingTop: 5,
    textAlign: "center",
  },
  textpolicy: {
    paddingTop: 10,
    width: "100%",
    fontStyle: "italic",
    color: Colors.BLUE_TEXT_LINK,
  },
  text: {
    fontSize: 14,
    paddingVertical: 5,
    paddingLeft: 20,
  },
  textChildren: {
    fontSize: 14,
    paddingVertical: 5,
    paddingLeft: 35,
  },
  detailText: {
    fontSize: 14,
    paddingVertical: 5,
    paddingLeft: 5,
  },
  image: {
    alignItems: "center",
    marginLeft: 80,
    width: 0.5 * width,
    height: 0.5 * height,
  },
});
