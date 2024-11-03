import 'package:flutter/material.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:mobile/models/user.dart';

class UserScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Truy cập dữ liệu người dùng từ UserProvider
    final user = Provider.of<UserProvider>(context).user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông tin người dùng'),
      ),
      body: user == null
          ? const Center(child: Text('Không tìm thấy người dùng.'))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('id: ${user.id}', style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                  Text('Họ: ${user.hoKh}', style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                  Text('Tên: ${user.tenKh}', style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                  Text('Email: ${user.emailKh}',
                      style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                  Text('Số điện thoại: ${user.sdtKh}',
                      style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                ],
              ),
            ),
    );
  }
}
