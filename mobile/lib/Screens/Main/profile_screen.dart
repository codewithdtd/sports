import 'package:flutter/material.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class Profile extends StatefulWidget {
  const Profile({super.key});

  @override
  State<Profile> createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context)
        .user; // Lấy user từ Provider trong phương thức build
    final token = Provider.of<UserProvider>(context).token;
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
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
                  Text('Token: ${token}', style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                ],
              ),
            ),
    );
  }
}
