import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/booking_screen.dart';
import 'package:mobile/Screens/Main/history_screen.dart';
import 'package:mobile/Screens/Main/notification_screen.dart';
import 'package:mobile/Screens/Main/review_screen.dart';
import 'package:mobile/Screens/Main/profile_screen.dart';
import 'package:mobile/models/notification_model.dart';
import 'package:mobile/services/notification.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  // Danh sách các màn hình cần hiển thị khi người dùng chọn từng mục trên BottomNavigationBar
  final List<Widget> screens = [
    BookingScreen(),
    ReviewScreen(), // Màn hình thông báo
    History(),
    NotificationScreen(), // Màn hình lịch sử
    Profile(), // Màn hình hồ sơ
  ];

  // Cập nhật chỉ mục hiện tại khi người dùng chọn mục mới trên BottomNavigationBar
  void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  Future<int> _getAllData() async {
    final String? token =
        Provider.of<UserProvider>(context, listen: false).token;
    final String? userId =
        Provider.of<UserProvider>(context, listen: false).user?.id;
    final response =
        await NotifyService(token: token).getAll(userId.toString());
    final filteredResponse =
        response.where((notification) => notification.daXem == false);
    return filteredResponse.length;
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
            icon: _buildIcon(Icons.feedback, 1),
            label: 'Đánh giá',
          ),
          BottomNavigationBarItem(
            icon: _buildIcon(Icons.receipt_long_rounded, 2),
            label: 'Lịch sử',
          ),
          BottomNavigationBarItem(
            icon: FutureBuilder<int>(
              future: _getAllData(),
              builder: (context, snapshot) {
                // if (snapshot.connectionState == ConnectionState.waiting) {
                //   return Stack(
                //     children: [
                //       _buildIcon(Icons.notifications_none_rounded, 3),
                //       Positioned(
                //         right: 0,
                //         // child: _loadingBadge(),
                //         child: Container(),
                //       ),
                //     ],
                //   );
                // } else
                if (snapshot.hasData && snapshot.data! > 0) {
                  return Stack(
                    children: [
                      _buildIcon(Icons.notifications_none_rounded, 3),
                      Positioned(
                        right: 0,
                        child: _notificationBadge(snapshot.data!),
                      ),
                    ],
                  );
                }
                return _buildIcon(Icons.notifications_none_rounded, 3);
              },
            ),
            label: 'Thông báo',
          ),
          BottomNavigationBarItem(
            icon: _buildIcon(Icons.account_circle_outlined, 4),
            label: 'Tài khoản',
          ),
        ],
        selectedItemColor: Colors.greenAccent[700], // Màu của mục được chọn
        unselectedItemColor: Colors.grey, // Màu của mục không được chọn
        showSelectedLabels: true, // Hiển thị label cho các mục không được chọn
        selectedLabelStyle: TextStyle(
          color: Colors.black,
          fontWeight: FontWeight.w500,
        ),
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

Widget _notificationBadge(int count) {
  return Container(
    padding: const EdgeInsets.all(4.0),
    decoration: BoxDecoration(
      color: Colors.red,
      shape: BoxShape.circle,
    ),
    child: Text(
      '$count',
      style: TextStyle(
        color: Colors.white,
        fontSize: 12.0,
        fontWeight: FontWeight.bold,
      ),
    ),
  );
}

Widget _loadingBadge() {
  return Container(
    padding: const EdgeInsets.all(4.0),
    decoration: BoxDecoration(
      color: Colors.grey,
      shape: BoxShape.circle,
    ),
    child: SizedBox(
      width: 10.0,
      height: 10.0,
      child: CircularProgressIndicator(
        strokeWidth: 2.0,
        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
      ),
    ),
  );
}
