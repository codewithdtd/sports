import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/Screens/Main/home_screen.dart';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/services/booking.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class CornfirmScreen extends StatefulWidget {
  final List<DatSan> list;

  const CornfirmScreen({
    super.key,
    required this.list,
  });

  @override
  State<CornfirmScreen> createState() => _CornfirmScreenState();
}

class _CornfirmScreenState extends State<CornfirmScreen> {
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _phoneController;
  late TextEditingController _emailController;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<UserProvider>(context, listen: false).user;

    // Khởi tạo các TextEditingController
    _firstNameController = TextEditingController(text: user?.hoKh);
    _lastNameController = TextEditingController(text: user?.tenKh);
    _phoneController = TextEditingController(text: user?.sdtKh);
    _emailController = TextEditingController(text: user?.emailKh);
  }

  String formatCurrency(int? number) {
    final formatter =
        NumberFormat('#,##0', 'vi_VN'); // Định dạng theo locale Việt Nam
    return formatter.format(number);
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  // void _updateUserInfo() {
  //   // Thực hiện cập nhật thông tin người dùng ở đây
  //   final userProvider = Provider.of<UserProvider>(context, listen: false);
  //   userProvider.updateUser(
  //     name: _nameController.text,
  //     phone: _phoneController.text,
  //     email: _emailController.text,
  //   );
  // }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;
    final String? token = Provider.of<UserProvider>(context).token;

    int _calculateTotalPrice(DatSan item) {
      int newTotal = 0;

      newTotal += item.thanhTien ?? 0;
      if (item.dichVu != null) {
        for (var dichVu in item.dichVu!) {
          newTotal += dichVu.thanhTien ?? 0;
        }
      }

      return newTotal;
    }

    int _calculateTotal() {
      int newTotal = 0;

      for (var field in widget.list) {
        newTotal += field.thanhTien ?? 0;
        if (field.dichVu != null) {
          for (var dichVu in field.dichVu!) {
            newTotal += dichVu.thanhTien ?? 0;
          }
        }
      }

      return newTotal;
    }

    Future<void> _createBooking() async {
      try {
        for (var booking in widget.list) {
          booking.khachHang = KhachHang(
            id: user?.id,
            hoKh: _firstNameController.text,
            tenKh: _lastNameController.text,
            emailKh: _emailController.text,
            sdtKh: _phoneController.text,
          );
          booking.ngayDat = booking.ngayDat?.split(' ')[0];
          final newBooking = {
            ...booking
                .toJson(), // Sử dụng toJson() để chuyển đổi đối tượng booking thành Map
          };
          // print(newBooking);

          final response =
              await BookingService(token: token).createBooking(newBooking);

          if (response == null) {
            throw Exception("Booking creation failed");
          }
        }

        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.green,
            content: Text(
              "Thành công",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        );

        // ignore: use_build_context_synchronously
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => HomeScreen()),
        );
      } catch (e) {
        print("Error: $e");
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.red,
            content: Text(
              "Thất bại",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        );
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Xác nhận'),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hiển thị và chỉnh sửa thông tin người dùng
            TextField(
              controller: _firstNameController,
              decoration: InputDecoration(labelText: 'Họ'),
            ),
            TextField(
              controller: _lastNameController,
              decoration: InputDecoration(labelText: 'Tên'),
            ),
            TextField(
              controller: _phoneController,
              decoration: InputDecoration(labelText: 'Số điện thoại'),
              keyboardType: TextInputType.phone,
            ),
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 10),
            Center(
              child: Text(
                'Danh sách sân',
                style: TextStyle(
                  color: Colors.greenAccent[700],
                  fontWeight: FontWeight.bold,
                  fontSize: 20.0,
                ),
              ),
            ),
            // Hiển thị danh sách `list`
            Expanded(
              child: ListView.builder(
                itemCount: widget.list.length,
                itemBuilder: (context, index) {
                  final item = widget.list[index];
                  return Container(
                    padding:
                        EdgeInsets.symmetric(horizontal: 7.0, vertical: 15.0),
                    decoration: BoxDecoration(
                      color: Colors.greenAccent,
                      borderRadius: BorderRadius.circular(10.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.4), // Màu bóng
                          spreadRadius: 3,
                          blurRadius: 5,
                          offset: Offset(0, 3), // Vị trí bóng
                        ),
                      ],
                    ),
                    margin: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${index + 1}. ${item.san!.maSan}',
                              style: TextStyle(
                                  fontSize: 16.0, fontWeight: FontWeight.w500),
                            ),
                            if (item.dichVu != null)
                              ...item.dichVu!
                                  .map((e) => Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text('${e.tenDv} x ${e.soluong}'),
                                          Text(
                                              'Thành tiền: ${formatCurrency(e.thanhTien)}đ'),
                                        ],
                                      ))
                                  .toList(),
                            Text(
                              'Tổng: ${formatCurrency(_calculateTotalPrice(item))}đ',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16.0),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${item.ngayDat?.split(' ')[0]}',
                              style: TextStyle(
                                  fontSize: 16.0, fontWeight: FontWeight.w500),
                            ),
                            Text(
                              '${item.thoiGianBatDau} - ${item.thoiGianKetThuc}',
                            ),
                          ],
                        )
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tổng: ${formatCurrency(_calculateTotal())}',
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
                onPressed: () => _createBooking(),
                child: Text(
                  'Đặt sân',
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
