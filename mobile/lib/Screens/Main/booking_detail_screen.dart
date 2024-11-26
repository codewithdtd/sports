import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/confirm_screen.dart';
import 'package:mobile/components/service_modal.dart';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/time_model.dart';
import 'package:mobile/services/service.dart';
import 'package:mobile/services/sport_field.dart';
import 'package:intl/intl.dart';
import 'package:mobile/services/time.dart';

class BookingDetailScreen extends StatefulWidget {
  final String? sportType;

  const BookingDetailScreen({Key? key, required this.sportType})
      : super(key: key);

  @override
  _BookingDetailScreenState createState() => _BookingDetailScreenState();
}

class _BookingDetailScreenState extends State<BookingDetailScreen> {
  final Map<String, SportFieldBooked> selectedFieldMap = {};
  final List<SportFieldBooked> fields = [];
  final List<DatSan> fieldsSelected = [];
  final List<DichVu> services = [];
  int startTimeHour = 8;
  int startTimeMinutes = 0;
  int endTimeHour = 22;
  int endTimeMinutes = 30;
  Time times = Time();
  DateTime? selectedDate;
  int total = 0;
  late Future<void> _allDataFuture;

  // List<TimeOfDay> _generateTimeSlots() {
  //   Duration interval = widget.sportType == 'Bóng đá'
  //       ? const Duration(hours: 1, minutes: 30)
  //       : const Duration(hours: 1);
  //   List<TimeOfDay> timeSlots = [];
  //   TimeOfDay startTime = TimeOfDay(hour: 8, minute: 0);
  //   TimeOfDay endTime = TimeOfDay(hour: 22, minute: 30);

  //   while (startTime.hour < endTime.hour ||
  //       (startTime.hour == endTime.hour && startTime.minute < endTime.minute)) {
  //     timeSlots.add(startTime);

  //     int newHour = startTime.hour + interval.inHours;
  //     int newMinute = startTime.minute + interval.inMinutes % 60;
  //     if (newMinute >= 60) {
  //       newHour += 1;
  //       newMinute -= 60;
  //     }
  //     newHour = newHour % 24;
  //     startTime = TimeOfDay(hour: newHour, minute: newMinute);
  //   }
  //   return timeSlots;
  // }
  List<String> _generateTimeSlots(
      double startTime, double endTime, double interval) {
    List<String> timeSlots = [];

    double time = startTime;
    while (time < endTime) {
      // Lấy giờ và phút cho thời gian bắt đầu
      int hour = time.floor();
      int minute = ((time % 1) * 60).round();

      // Tính toán giờ và phút kết thúc theo khoảng thời gian
      double endTimeInterval = time + interval;
      int hourEnd = endTimeInterval.floor();
      int minuteEnd = ((endTimeInterval % 1) * 60).round();

      // Định dạng lại giờ cho đẹp
      String formattedTimeStart =
          '${hour.toString().padLeft(2, '0')}:${minute == 0 ? '00' : minute.toString().padLeft(2, '0')}';
      String formattedTimeEnd =
          '${hourEnd.toString().padLeft(2, '0')}:${minuteEnd == 0 ? '00' : minuteEnd.toString().padLeft(2, '0')}';

      // Thêm vào danh sách thời gian
      timeSlots.add('$formattedTimeStart-$formattedTimeEnd');

      // Cộng thêm khoảng thời gian vào thời gian hiện tại
      time += interval;
    }

    return timeSlots;
  }

  String formatCurrency(int? number) {
    final formatter =
        NumberFormat('#,##0', 'vi_VN'); // Định dạng theo locale Việt Nam
    return formatter.format(number);
  }

  int convertHourToDecimal(String? time) {
    List<String> parts = time!.split(":");
    int hour = int.parse(parts[0]);
    int minute = int.parse(parts[1]);
    return hour;
  }

  int convertMinutesToDecimal(String? time) {
    List<String> parts = time!.split(":");
    int hour = int.parse(parts[0]);
    int minute = int.parse(parts[1]);
    return minute;
  }

  Future<void> _getTime() async {
    final List<Time> time = await TimeService().getAll();
    setState(() {
      times = time[0];
    });
  }

  double _timeStringToDouble(String? time) {
    // Tách giờ và phút từ chuỗi thời gian
    List<String> parts = time!.split(':');

    // Chuyển đổi giờ và phút thành số
    int hour = int.parse(parts[0]);
    int minute = int.parse(parts[1]);

    // Tính toán giá trị double (giờ + phút/60)
    return hour + minute / 60.0;
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
        // total = 0;
        // fieldsSelected.clear();
      });
    }
    _getAllBooked();
  }

  void _calculateTotalPrice() {
    int newTotal = 0;

    for (var field in fieldsSelected) {
      newTotal += field.thanhTien ?? 0;
      if (field.dichVu != null) {
        for (var dichVu in field.dichVu!) {
          newTotal += dichVu.thanhTien ?? 0;
        }
      }
    }

    setState(() {
      total = newTotal;
    });
  }

  bool _isSameBooking(DatSan booking1, DatSan booking2) {
    return booking1.san?.id == booking2.san?.id &&
        booking1.thoiGianBatDau == booking2.thoiGianBatDau &&
        booking1.thoiGianKetThuc == booking2.thoiGianKetThuc &&
        booking1.ngayDat == booking2.ngayDat;
  }

  void _showServiceOptions(String key, SportFieldBooked field, DatSan booking) {
    List<DichVu> resetServices = services.map((service) {
      // Tạo bản sao sâu cho từng dịch vụ
      return DichVu(
        id: service.id,
        tenDv: service.tenDv,
        tonKho: service.tonKho, // Đặt soluong về 0
        gia: service.gia,
        thanhTien: 0, // Đặt thanhTien về 0 nếu cần
        soluong: 0, // Đặt soluong về 0
      );
    }).toList();

    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return ServiceSelectionSheet(
          availableServices:
              resetServices, // Sử dụng danh sách đã tạo bản sao sâu
          onConfirm: (List<DichVu> selectedServices) {
            setState(() {
              // Cập nhật tonKho cho mỗi dịch vụ đã chọn
              for (var selectedService in selectedServices) {
                var index = services
                    .indexWhere((service) => service.id == selectedService.id);
                if (index != -1) {
                  services[index].tonKho = (services[index].tonKho ?? 0) -
                      (selectedService.soluong ?? 0);
                }
              }

              booking.dichVu =
                  selectedServices; // Cập nhật dịch vụ riêng cho booking
              selectedFieldMap[key] = field;
              fieldsSelected.removeWhere((existingBooking) =>
                  _isSameBooking(existingBooking, booking)); // Xóa nếu trùng
              fieldsSelected.add(booking); // Thêm lại với dịch vụ mới
            });
            _calculateTotalPrice(); // Cập nhật tổng số tiền
          },
        );
      },
    );
  }

  Future<void> _getAllBooked() async {
    final String date = selectedDate != null
        ? '${selectedDate!.year}-${selectedDate!.month.toString().padLeft(2, '0')}-${selectedDate!.day.toString().padLeft(2, '0')}'
        : '${DateTime.now().year}-${DateTime.now().month.toString().padLeft(2, '0')}-${DateTime.now().day.toString().padLeft(2, '0')}';
    // final fields = await SportFieldService().getAllBooked(date);
    try {
      // Gọi hàm lấy tất cả các trường đã đặt
      final List<SportFieldBooked> bookedFields =
          await SportFieldService().getAllBooked(date);
      // final List<Time> time = await TimeService().getAll();
      // final List<DichVu> allService = await DichVuService().getAll();

      // Lọc các trường theo loại
      final List<SportFieldBooked> filteredFields = bookedFields
          .where((item) => item.loaiSan?.tenLoai == widget.sportType)
          .toList();

      // Cập nhật trạng thái
      setState(() {
        fields.clear(); // Clear old data
        fields.addAll(filteredFields); // Thêm các trường đã lọc
      });
    } catch (e) {
      // Xử lý lỗi (nếu cần)
      print('Error fetching booked fields: $e');
    }
  }

  Future<void> _getAllService() async {
    final List<DichVu> allService = await DichVuService().getAll();
    setState(() {
      services.addAll(allService);
    });
  }

  void _toggleSelection(String key, SportFieldBooked field, String startTime,
      String endTime, String ngayDat) {
    DatSan booking = DatSan(
      thanhTien: field.bangGiaMoiGio,
      thoiGianBatDau: startTime,
      thoiGianKetThuc: endTime,
      san: field,
      ngayDat: ngayDat,
    );

    setState(() {
      if (selectedFieldMap.containsKey(key)) {
        // Bỏ chọn nếu đã chọn
        selectedFieldMap.remove(key);
        fieldsSelected.removeWhere((existingBooking) {
          bool isSameBooking = _isSameBooking(existingBooking, booking);
          if (isSameBooking && existingBooking.dichVu != null) {
            // Hoàn trả số lượng dịch vụ tương ứng
            for (var service in existingBooking.dichVu!) {
              var index = services.indexWhere((s) => s.id == service.id);
              if (index != -1) {
                services[index].tonKho =
                    (services[index].tonKho ?? 0) + (service.soluong ?? 0);
              }
            }
          }
          return isSameBooking; // Trả về true để xóa booking
        });

        _calculateTotalPrice();
      } else {
        // selectedFieldMap[key] = field; // Thêm vào nếu chưa chọn
        // fieldsSelected.add(booking);
        _showServiceOptions(key, field,
            booking); // Hiển thị ServiceSelectionSheet khi chọn field
      }
    });

    print(key);
  }

  Future<void> _getAllData() async {
    try {
      // Chạy nhiều Future đồng thời
      await Future.wait([
        _getAllBooked(),
        _getAllService(),
        _getTime(),
      ]);
      // Tiếp tục xử lý sau khi tất cả các Future hoàn thành
    } catch (e) {
      print('Error: $e');
    }
  }

  @override
  void initState() {
    super.initState();
    selectedDate =
        DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
    // _getAllBooked();
    // _getAllService();
    // _getTime();
    _allDataFuture = _getAllData();
  }

  @override
  Widget build(BuildContext context) {
    final double interval = widget.sportType == 'Bóng đá' ? 1.5 : 1;
    if (times.id != null) {
      final double thoiGianMoCua = _timeStringToDouble(times.thoiGianMoCua!);
      final double thoiGianDongCua =
          _timeStringToDouble(times.thoiGianDongCua!);
      final List<String> timeSlots =
          _generateTimeSlots(thoiGianMoCua, thoiGianDongCua, interval);
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.sportType ?? 'Chi tiết đặt sân'),
        backgroundColor: Colors.greenAccent[400],
      ),
      body: FutureBuilder(
        future: _allDataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Có lỗi xảy ra'));
          } else {
            // Dữ liệu đã được tải thành công, tiếp tục hiển thị giao diện
            double interval = widget.sportType == 'Bóng đá' ? 1.5 : 1;
            double thoiGianMoCua = _timeStringToDouble(times.thoiGianMoCua);
            double thoiGianDongCua = _timeStringToDouble(times.thoiGianDongCua);
            List<String> timeSlots =
                _generateTimeSlots(thoiGianMoCua, thoiGianDongCua, interval);

            return Column(
              children: [
                SizedBox(
                  height: 10.0,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10.0),
                        border: Border.all(color: Colors.green, width: 1.5),
                        color: Color.fromARGB(53, 86, 255, 125),
                        // border: Border.all(
                        //     color: const Color.fromARGB(255, 133, 133, 133), width: 2.0),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 2.0, horizontal: 16.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              selectedDate == null
                                  ? 'Chọn ngày'
                                  : '${selectedDate!.day}/${selectedDate!.month}',
                              style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green),
                            ),
                            IconButton(
                              icon: const Icon(
                                Icons.calendar_today,
                                color: Colors.green,
                              ),
                              onPressed: () => _selectDate(context),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Text(
                      widget.sportType == 'Bóng đá'
                          ? 'Đơn giá / 1.5 giờ'
                          : 'Đơn giá / 1 giờ',
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.greenAccent[700],
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            height: 20.0,
                            width: 20.0,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(width: 4.0),
                          const Text('Trống'),
                          const SizedBox(width: 25.0),
                          Container(
                            height: 20.0,
                            width: 20.0,
                            color: Colors.greenAccent[400],
                          ),
                          const SizedBox(width: 4.0),
                          const Text('Đang chọn'),
                          const SizedBox(width: 4.0),
                        ],
                      ),
                      const SizedBox(
                        height: 15.0,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            height: 20.0,
                            width: 20.0,
                            color: Colors.red[300],
                          ),
                          const SizedBox(width: 4.0),
                          const Text('Đã được đặt hoặc bảo trì'),
                        ],
                      )
                    ],
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: timeSlots.length - 1,
                    itemBuilder: (context, index) {
                      String startText = timeSlots[index].split('-')[0];
                      String endText = timeSlots[index].split('-')[1];
                      // TimeOfDay end = timeSlots[index + 1];
                      // String startText = start.format(context);
                      // String endText = end.format(context);

                      return Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 10.0,
                          ),
                          Text(
                            '$startText - $endText',
                            // '${timeSlots[index]}',
                            style: TextStyle(
                                fontSize: 16.0, fontWeight: FontWeight.w400),
                          ),
                          if (fields.length > 0)
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: Row(
                                  children: [
                                    const SizedBox(width: 10),
                                    for (var field in fields)
                                      Padding(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 4.0),
                                        child: ElevatedButton(
                                          onPressed: (field.datSan
                                                          ?.thoiGianBatDau ==
                                                      startText ||
                                                  field.tinhTrang ==
                                                      'Bảo trì' ||
                                                  (int.tryParse(startText
                                                              .substring(
                                                                  0, 2))! <=
                                                          DateTime.now()
                                                              .hour) &&
                                                      selectedDate?.isAtSameMomentAs(
                                                              DateTime(
                                                                  DateTime.now()
                                                                      .year,
                                                                  DateTime.now()
                                                                      .month,
                                                                  DateTime.now()
                                                                      .day)) ==
                                                          true)
                                              ? null
                                              : () {
                                                  String key =
                                                      '${field.id}-$startText-$endText-$selectedDate';
                                                  _toggleSelection(
                                                    key,
                                                    field,
                                                    startText,
                                                    endText,
                                                    selectedDate.toString(),
                                                  ); // Truyền `field` vào _toggleSelection
                                                },
                                          // ignore: sort_child_properties_last
                                          child: Column(
                                            children: [
                                              Text(
                                                '${field.maSan}',
                                                style: TextStyle(
                                                    color: Colors.black),
                                              ),
                                              Text(
                                                '${formatCurrency(field.bangGiaMoiGio)}',
                                                style: TextStyle(
                                                    color: Colors.black,
                                                    fontSize: 12.0),
                                              )
                                            ],
                                          ),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor:
                                                selectedFieldMap.containsKey(
                                                        '${field.id}-$startText-$endText-$selectedDate')
                                                    ? Colors.greenAccent[400]
                                                    : Colors.grey[300],
                                            disabledBackgroundColor:
                                                Colors.red[300],
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                            ),
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          SizedBox(width: 10.0),
                          if (fields.length < 1) Text('Chưa có sân'),
                        ],
                      );
                    },
                  ),
                ),
              ],
            );
          }
        },
      ),
      bottomNavigationBar: BottomAppBar(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tổng: ${formatCurrency(total)}đ',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              // GestureDetector(
              //   onTap: () {},
              //   child: Container(
              //     height: 80.0,
              //     width: 120.0,
              //     decoration: BoxDecoration(
              //       color: Colors.greenAccent[700],
              //       borderRadius: BorderRadius.circular(18.0),
              //     ),
              //     child: Center(child: Text('Thanh toán')),
              //   ),
              // )
              ElevatedButton(
                onPressed: () {
                  // Xử lý logic thanh toán ở đây
                  if (fieldsSelected.length > 0)
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            CornfirmScreen(list: fieldsSelected),
                      ),
                    );
                },
                child: Text(
                  'Thanh toán',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16.0,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.greenAccent[700],
                  padding: EdgeInsets.symmetric(horizontal: 30, vertical: 12.0),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
