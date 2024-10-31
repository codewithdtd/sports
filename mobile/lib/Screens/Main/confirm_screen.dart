import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/booked_model.dart';
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
                            Text(
                                'Thành tiền: ${formatCurrency(item.thanhTien)}'),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
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
                'Tổng: 0đ',
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
                },
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
