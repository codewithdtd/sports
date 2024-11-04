import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/booking_screen.dart';
import 'package:mobile/Screens/Main/history_screen.dart';
import 'package:mobile/Screens/Main/notify_screen.dart';
import 'package:mobile/Screens/Main/profile_screen.dart';
import 'package:mobile/Screens/User/user_screen.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  // Danh sách các màn hình cần hiển thị khi người dùng chọn từng mục trên BottomNavigationBar
  final List<Widget> screens = [
    BookingScreen(),
    Notify(), // Màn hình thông báo
    History(), // Màn hình lịch sử
    Profile(), // Màn hình hồ sơ
  ];

  // Cập nhật chỉ mục hiện tại khi người dùng chọn mục mới trên BottomNavigationBar
  void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: screens[
          _currentIndex], // Hiển thị trang tương ứng với chỉ mục hiện tại
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex, // Chỉ mục của mục hiện tại
        onTap: _onItemTapped, // Gọi hàm khi mục được chọn
        items: [
          BottomNavigationBarItem(
            icon: _buildIcon(Icons.home_filled, 0),
            label: 'Trang chủ',
          ),
          BottomNavigationBarItem(
            icon: _buildIcon(Icons.notifications_none_sharp, 1),
            label: 'Thông báo',
          ),
          BottomNavigationBarItem(
            icon: _buildIcon(Icons.receipt_long_rounded, 2),
            label: 'Lịch sử',
          ),
          BottomNavigationBarItem(
            icon: _buildIcon(Icons.account_circle_outlined, 3),
            label: 'Tài khoản',
          ),
        ],
        // selectedItemColor: Colors.white, // Màu của mục được chọn
        unselectedItemColor: Colors.grey, // Màu của mục không được chọn
        showSelectedLabels: true, // Hiển thị label cho các mục không được chọn
      ),
    );
  }

  Widget _buildIcon(IconData iconData, int index) {
    bool isSelected = _currentIndex == index;

    return Container(
      padding: const EdgeInsets.all(8.0), // Padding cho icon
      decoration: BoxDecoration(
        color: isSelected
            ? Colors.greenAccent[700]?.withOpacity(1.0)
            : Colors.transparent, // Màu nền nếu mục được chọn
        shape: BoxShape.circle, // Hình dạng hình tròn
      ),
      child: Icon(
        iconData,
        size: 26.0,
        color: isSelected ? Colors.white : Colors.black54, // Màu icon
      ),
    );
  }
}
