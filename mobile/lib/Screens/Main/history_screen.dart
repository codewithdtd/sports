import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/Screens/Main/add_review_screen.dart';
import 'package:mobile/Screens/Main/order_detail_screen.dart';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/notification_model.dart';
import 'package:mobile/models/rating_model.dart';
import 'package:mobile/services/booking.dart';
import 'package:mobile/services/notification.dart';
import 'package:mobile/services/review.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class History extends StatefulWidget {
  static const routeName = '/history';

  const History({super.key});

  @override
  State<History> createState() => _HistoryState();
}

class _HistoryState extends State<History> {
  late Future<List<DatSan>> futureList;
  final List<Rating> reviewed = [];

  @override
  void initState() {
    super.initState();
    futureList = _fetchData();
    _fetchReviewed();
  }

  Future<List<DatSan>> _fetchData() async {
    final String? token =
        Provider.of<UserProvider>(context, listen: false).token;
    final String? userId =
        Provider.of<UserProvider>(context, listen: false).user!.id;
    try {
      final response = await BookingService(token: token)
          .getAll(queryParams: {'id': userId});
      return response.reversed.toList();
    } catch (error, stackTrace) {
      print('Lỗi khi lấy dữ liệu: $error');
      print('Stack Trace: $stackTrace');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải dữ liệu. Vui lòng thử lại sau.')),
      );
      return [];
    }
  }

  Future<void> _fetchReviewed() async {
    try {
      final String? token =
          Provider.of<UserProvider>(context, listen: false).token;
      final List<DatSan> datSanList = await futureList;

      // Tạo danh sách tạm để lưu các review mà không cần gọi setState liên tục
      final List<Rating> tempReviewed = [];

      for (var item in datSanList) {
        try {
          // Gọi API và bắt lỗi riêng cho từng lần gọi
          final review =
              await ReviewService(token: token).getOne({"datSan._id": item.id});

          // ignore: unnecessary_null_comparison
          if (review != null) {
            tempReviewed.add(review); // Chỉ thêm review nếu không null
          }
        } catch (error) {
          // Bắt lỗi riêng cho từng lần gọi API và in ra console
          print('Không tìm thấy review cho ${item.id}: $error');
        }
      }

      // Cập nhật state sau khi hoàn thành vòng lặp
      setState(() {
        reviewed.addAll(tempReviewed);
      });
    } catch (e) {
      print('Lỗi khi lấy reviewed: $e');
    }
  }

  Future<void> _confirmCancelBooking(DatSan item) async {
    final token = Provider.of<UserProvider>(context, listen: false).token;
    final result = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Xác nhận hủy'),
          content: Text(
              'Bạn có chắc chắn muốn hủy đơn đặt sân ${item.san!.maSan} không?'),
          actions: [
            TextButton(
              child: Text('Không'),
              onPressed: () {
                Navigator.of(context).pop(false);
              },
            ),
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop(true);
              },
            ),
          ],
        );
      },
    );

    if (result == true) {
      // Tiến hành cập nhật trạng thái đơn đặt sân thành "Đã hủy"
      try {
        final response = await BookingService(token: token).updateBooking(
          item.id.toString(),
          {"trangThai": "Đã hủy"},
        );
        final notify = NotificationModel(
            nguoiDung: 'Nhân viên',
            tieuDe: 'Hủy đặt sân',
            daXem: false,
            noiDung:
                'Người dùng ${item.khachHang?.sdtKh} hủy đặt sân ${item.id} mã sân ${item.san?.maSan} vào ${item.thoiGianBatDau}-${item.thoiGianKetThuc} ${item.ngayDat}');

        final newNotify =
            await NotifyService(token: token).createNotify(notify.toJson());
        // ignore: unnecessary_null_comparison
        if (response != null) {
          setState(() {
            futureList = _fetchData();
          });
        }
      } catch (e) {
        print('Error occurred while updating booking: $e');
        // Bạn cũng có thể hiển thị SnackBar để báo lỗi
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content:
                  Text('Không thể cập nhật trạng thái. Vui lòng thử lại sau.')),
        );
      }
    }
  }

  Future<void> _confirmRequestCancelBooking(DatSan item) async {
    final token = Provider.of<UserProvider>(context, listen: false).token;
    final result = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Xác nhận hủy'),
          content: Text(
              'Bạn có chắc chắn muốn yêu cầu hủy đơn đặt sân ${item.san!.maSan} không?'),
          actions: [
            TextButton(
              child: Text('Không'),
              onPressed: () {
                Navigator.of(context).pop(false);
              },
            ),
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop(true);
              },
            ),
          ],
        );
      },
    );

    if (result == true) {
      // Tiến hành cập nhật trạng thái đơn đặt sân thành "Đã hủy"
      try {
        final response = await BookingService(token: token).updateBooking(
          item.id.toString(),
          {"yeuCauHuy": true},
        );
        final notify = NotificationModel(
            nguoiDung: 'Nhân viên',
            tieuDe: 'Yêu cầu hủy đặt sân',
            daXem: false,
            noiDung:
                'Người dùng ${item.khachHang?.sdtKh} hủy đặt sân ${item.id} mã sân ${item.san?.maSan} vào ${item.thoiGianBatDau}-${item.thoiGianKetThuc} ${item.ngayDat}');

        final newNotify =
            await NotifyService(token: token).createNotify(notify.toJson());
        // ignore: unnecessary_null_comparison
        if (response != null) {
          setState(() {
            futureList = _fetchData();
          });
        }
      } catch (e) {
        print('Error occurred while updating booking: $e');
        // Bạn cũng có thể hiển thị SnackBar để báo lỗi
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content:
                  Text('Không thể cập nhật trạng thái. Vui lòng thử lại sau.')),
        );
      }
    }
  }

  Future<void> _openUrl(String? orderUrl) async {
    final Uri uri = Uri.parse(orderUrl.toString());
    if (await canLaunchUrl(uri)) {
      await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
    } else {
      print("Could not launch URL: ${orderUrl}");
    }
  }

  String formatCurrency(int? number) {
    final formatter = NumberFormat('#,##0', 'vi_VN');
    return formatter.format(number);
  }

  String timeEnd(String? time) {
    // Giả sử item.expireAt là chuỗi dạng "yyyy-MM-dd hh:mm"
    String originalTime = time!.substring(11, 16); // Lấy chuỗi "hh:mm"

    // Chuyển đổi chuỗi "hh:mm" thành DateTime
    DateTime expireTime = DateTime.parse("1970-01-01 $originalTime:00");

    // Thêm 5 phút
    DateTime newExpireTime = expireTime.add(Duration(minutes: 5));

    // Định dạng lại thời gian thành chuỗi "hh:mm"
    String displayTime =
        "${newExpireTime.hour.toString().padLeft(2, '0')}:${newExpireTime.minute.toString().padLeft(2, '0')}";

    // Hiển thị kết quả
    return displayTime;
  }

  int _calculateTotalPrice(DatSan item) {
    int newTotal = item.thanhTien ?? 0;
    if (item.dichVu != null) {
      for (var dichVu in item.dichVu!) {
        newTotal += dichVu.thanhTien ?? 0;
      }
    }
    if (item.phuThu != null) {
      newTotal += item.phuThu!;
    }
    return newTotal;
  }

  int tinhChenhLechNgay(String? ngayNhap) {
    // Tách chuỗi ngày nhập thành các phần tử ngày, tháng, năm
    List<String> parts = ngayNhap!.split('/');
    int day = int.parse(parts[0]);
    int month = int.parse(parts[1]);
    int year = int.parse(parts[2]);

    // Tạo đối tượng DateTime từ ngày nhập
    DateTime date1 = DateTime(year, month, day);

    // Lấy ngày hiện tại
    DateTime date2 =
        DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);

    // Tính số mili-giây giữa hai ngày và chuyển thành số ngày
    int diffInMs = date2.difference(date1).inMilliseconds;
    int diffInDays = (diffInMs / (1000 * 60 * 60 * 24)).ceil();

    // Kiểm tra và in thông báo nếu số ngày chênh lệch là số âm
    print(diffInDays < 0);

    return diffInDays;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Center(
          child: Text(
            "Lịch sử đặt sân",
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        backgroundColor: Colors.greenAccent[700],
        automaticallyImplyLeading: false,
      ),
      body: Container(
        color: Colors.grey[300],
        child: Column(
          children: [
            // SizedBox(
            //   height: MediaQuery.of(context).size.height * 0.06,
            // ),
            // const Text(
            //   "Lịch sử đặt sân",
            //   style: TextStyle(
            //     fontSize: 24,
            //     fontWeight: FontWeight.bold,
            //     color: Color.fromARGB(255, 0, 216, 90),
            //   ),
            // ),
            Expanded(
              child: FutureBuilder<List<DatSan>>(
                future: futureList,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return const Center(
                        child: Text('Đã xảy ra lỗi khi tải dữ liệu'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return const Center(child: Text('Không có dữ liệu'));
                  } else {
                    final list = snapshot.data!;
                    return ListView.builder(
                      padding: const EdgeInsets.only(
                          left: 16.0, right: 16.0, bottom: 15.0),
                      itemCount: list.length,
                      itemBuilder: (context, index) {
                        final item = list[index];
                        return Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 7.0, vertical: 15.0),
                          decoration: BoxDecoration(
                            color: Color.fromARGB(255, 255, 255, 255),
                            borderRadius: BorderRadius.circular(5.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.7),
                                spreadRadius: 3,
                                blurRadius: 5,
                                offset: const Offset(3, 3),
                              ),
                            ],
                          ),
                          margin: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '${item.san!.maSan} - ${item.san!.tenSan}',
                                        style: const TextStyle(
                                            fontSize: 17.0,
                                            fontWeight: FontWeight.w700),
                                      ),
                                      if (item.dichVu != null)
                                        ...item.dichVu!.map((e) => Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                    '${e.tenDv} x ${e.soluong}'),
                                                Text(
                                                    'Thành tiền: ${formatCurrency(e.thanhTien)}đ'),
                                              ],
                                            )),
                                    ],
                                  ),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text('${item.ngayDat!.split(' ')[0]}',
                                          style: const TextStyle(
                                              fontSize: 16.0,
                                              fontWeight: FontWeight.w500)),
                                      Text(
                                          '${item.thoiGianBatDau} - ${item.thoiGianKetThuc}'),
                                      Text(
                                        '${item.trangThai}',
                                        style: TextStyle(
                                          fontSize: 17.0,
                                          fontWeight: FontWeight.w500,
                                          color: item.trangThai == "Đã hủy"
                                              ? Colors.red
                                              : item.trangThai == "Đã duyệt"
                                                  ? Colors.blue[700]
                                                  : item.trangThai ==
                                                          "Hoàn thành"
                                                      ? Colors.greenAccent[700]
                                                      : Colors.black,
                                        ),
                                      ),
                                    ],
                                  )
                                ],
                              ),
                              if (item.trangThai != 'Hoàn thành')
                                Text(
                                  '${item.trangThaiThanhToan} - ${formatCurrency(item.thanhTien)}',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 17.0),
                                ),
                              if (item.trangThai == 'Hoàn thành')
                                Text(
                                  '${item.trangThaiThanhToan}',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 17.0),
                                ),
                              const SizedBox(height: 8.0),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  if (reviewed.any(
                                      (review) => review.datSan?.id == item.id))
                                    GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                AddRatingScreen(
                                              datSan: item,
                                              review: reviewed.firstWhere(
                                                  (review) =>
                                                      review.datSan?.id ==
                                                      item.id // Trả về null nếu không tìm thấy
                                                  ),
                                              view: true,
                                            ),
                                          ),
                                        );
                                      },
                                      child: Container(
                                        height: 35.0,
                                        width: 120.0,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          border: Border.all(
                                              color: Colors.green, width: 2.0),
                                          borderRadius:
                                              BorderRadius.circular(6.0),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Xem đánh giá',
                                            style: TextStyle(
                                              color: Colors.green,
                                              fontSize: 16.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  if (item.trangThai == "Hoàn thành" &&
                                      tinhChenhLechNgay(item.ngayDat) < 4 &&
                                      !reviewed.any((review) =>
                                          review.datSan?.id == item.id))
                                    GestureDetector(
                                      onTap: () async {
                                        final result = await Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                AddRatingScreen(datSan: item),
                                          ),
                                        );
                                        if (result == true) {
                                          // Gọi setState để làm mới dữ liệu nếu `pop` trả về `true`
                                          setState(() {
                                            futureList = _fetchData();
                                          });
                                          _fetchReviewed();
                                        }
                                        // Navigator.push(
                                        //   context,
                                        //   MaterialPageRoute(
                                        //     builder: (context) =>
                                        //         AddRatingScreen(datSan: item),
                                        //   ),
                                        // );
                                      },
                                      child: Container(
                                        height: 35.0,
                                        width: 80.0,
                                        decoration: BoxDecoration(
                                          color: Colors.greenAccent[700],
                                          // border: Border.all(
                                          //     color: Colors.green, width: 2.0),
                                          borderRadius:
                                              BorderRadius.circular(6.0),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Đánh giá',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  const SizedBox(width: 8.0),
                                  if (item.trangThai == "Hoàn thành")
                                    GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                OrderScreen(datSan: item),
                                          ),
                                        );
                                      },
                                      child: Container(
                                        height: 35.0,
                                        width: 100.0,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          border: Border.all(
                                              color: Colors.green, width: 2.0),
                                          borderRadius:
                                              BorderRadius.circular(6.0),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Xem chi tiết',
                                            style: TextStyle(
                                              color: Colors.green,
                                              fontSize: 16.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  if (item.trangThai == "Đã duyệt" &&
                                      item.yeuCauHuy == false)
                                    GestureDetector(
                                      onTap: () =>
                                          _confirmRequestCancelBooking(item),
                                      child: Container(
                                        height: 35.0,
                                        width: 100.0,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          border: Border.all(
                                              color: Colors.red, width: 2.0),
                                          borderRadius:
                                              BorderRadius.circular(6.0),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Yêu cầu hủy',
                                            style: TextStyle(
                                              color: Colors.red,
                                              fontSize: 16.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  if (item.trangThai == "Đã duyệt" &&
                                      item.yeuCauHuy == true)
                                    const Text(
                                      'Đã gửi yêu cầu hủy',
                                      style: TextStyle(
                                        fontSize: 16.0,
                                        color: Colors.red,
                                        fontWeight: FontWeight.w500,
                                        fontStyle: FontStyle.italic,
                                      ),
                                    ),
                                  // const SizedBox(width: 8.0),
                                  if (item.order_url != null &&
                                      item.order_url != '' &&
                                      item.trangThai != 'Đã hủy')
                                    GestureDetector(
                                      onTap: () => _openUrl(item.order_url),
                                      child: Container(
                                        height: 35.0,
                                        width: 100.0,
                                        decoration: BoxDecoration(
                                          // color: Colors.red[300],
                                          borderRadius:
                                              BorderRadius.circular(6.0),
                                          border: Border.all(
                                            color: Colors.green,
                                            width: 2.0,
                                          ),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Thanh toán',
                                            style: TextStyle(
                                              color: Colors.green,
                                              fontSize: 15.0,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  const SizedBox(width: 8.0),
                                  if (item.trangThai == 'Chưa duyệt')
                                    GestureDetector(
                                      onTap: () => _confirmCancelBooking(item),
                                      child: Container(
                                        height: 35.0,
                                        width: 80.0,
                                        decoration: BoxDecoration(
                                          color: Colors.red[300],
                                          borderRadius:
                                              BorderRadius.circular(6.0),
                                        ),
                                        child: const Center(
                                          child: Text(
                                            'Hủy',
                                            style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 15.0,
                                                fontWeight: FontWeight.w500),
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              if (item.order_url != null &&
                                  item.order_url != '' &&
                                  item.trangThai != 'Đã hủy')
                                Text(
                                  'Đơn hàng sẽ hủy vào lúc ${timeEnd(item.expireAt)}',
                                ),
                            ],
                          ),
                        );
                      },
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
