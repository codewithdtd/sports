import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/confirm_screen.dart';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/sport_filed.dart';
import 'package:mobile/services/sport_field.dart';
import 'package:intl/intl.dart';

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

  DateTime? selectedDate;
  int total = 0;

  List<TimeOfDay> _generateTimeSlots() {
    Duration interval = widget.sportType == 'Bóng đá'
        ? const Duration(hours: 1, minutes: 30)
        : const Duration(hours: 1);
    List<TimeOfDay> timeSlots = [];
    TimeOfDay startTime = const TimeOfDay(hour: 8, minute: 0);
    TimeOfDay endTime = const TimeOfDay(hour: 22, minute: 30);

    while (startTime.hour < endTime.hour ||
        (startTime.hour == endTime.hour && startTime.minute < endTime.minute)) {
      timeSlots.add(startTime);

      int newHour = startTime.hour + interval.inHours;
      int newMinute = startTime.minute + interval.inMinutes % 60;
      if (newMinute >= 60) {
        newHour += 1;
        newMinute -= 60;
      }
      newHour = newHour % 24;
      startTime = TimeOfDay(hour: newHour, minute: newMinute);
    }
    return timeSlots;
  }

  String formatCurrency(int? number) {
    final formatter =
        NumberFormat('#,##0', 'vi_VN'); // Định dạng theo locale Việt Nam
    return formatter.format(number);
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime(2000),
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
    }

    setState(() {
      total = newTotal;
    });
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

  void _toggleSelection(String key, SportFieldBooked field, String startTime,
      String endTime, String ngayDat) {
    print(key);
    DatSan booking = DatSan(
      thanhTien: field.bangGiaMoiGio,
      thoiGianBatDau: startTime,
      thoiGianKetThuc: endTime,
      san: field,
      ngayDat: ngayDat,
    );
    setState(() {
      if (selectedFieldMap.containsKey(key)) {
        selectedFieldMap.remove(key); // Bỏ chọn nếu đã chọn
        fieldsSelected.remove(booking);
      } else {
        selectedFieldMap[key] = field; // Thêm vào nếu chưa chọn
        fieldsSelected.add(booking);
      }
    });
    _calculateTotalPrice();
    print(key);
  }

  @override
  void initState() {
    super.initState();
    selectedDate =
        DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day);
    _getAllBooked();
  }

  @override
  Widget build(BuildContext context) {
    List<TimeOfDay> timeSlots = _generateTimeSlots();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.sportType ?? 'Chi tiết đặt sân'),
        backgroundColor: Colors.greenAccent[400],
      ),
      body: Column(
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
                TimeOfDay start = timeSlots[index];
                TimeOfDay end = timeSlots[index + 1];
                String startText = start.format(context);
                String endText = end.format(context);

                return Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(
                      width: 10.0,
                    ),
                    Text(
                      '$startText - $endText',
                      style: TextStyle(
                          fontSize: 16.0, fontWeight: FontWeight.w400),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            const SizedBox(width: 10),
                            for (var field in fields)
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 4.0),
                                child: ElevatedButton(
                                  onPressed: (field.datSan?.thoiGianBatDau ==
                                              startText ||
                                          field.tinhTrang == 'Bảo trì')
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
                                        style: TextStyle(color: Colors.black),
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
                                    backgroundColor: selectedFieldMap.containsKey(
                                            '${field.id}-$startText-$endText-$selectedDate')
                                        ? Colors.greenAccent[400]
                                        : Colors.grey[300],
                                    disabledBackgroundColor: Colors.red[300],
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(width: 10.0),
                  ],
                );
              },
            ),
          ),
        ],
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
