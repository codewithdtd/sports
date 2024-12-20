import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/change_pass_sceen.dart';
import 'package:mobile/Screens/User/user_screen.dart';
import 'package:mobile/Screens/Welcome/welcome_screen.dart';
import 'package:mobile/services/user.dart';
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
    final userProvider = Provider.of<UserProvider>(context, listen: false);

    Future<void> _logout() async {
      try {
        // ignore: unused_local_variable
        final logout = await UserService(token: token).logout();
        userProvider.clearUser();
        // ignore: use_build_context_synchronously
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => const WelcomeScreen(),
          ),
        );
      } catch (e) {
        print('Lỗi đăng xuất');
      }
    }

    return Scaffold(
      body: user == null
          ? const Center(child: Text('Không tìm thấy người dùng.'))
          : Stack(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        // Container(
                        //   color: Colors.greenAccent[700],
                        //   height: MediaQuery.of(context).size.height * 0.25,
                        // ),
                        Image.asset(
                          'assets/images/bg-info.jpg',
                          height: MediaQuery.of(context).size.height * 0.25,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                        Positioned(
                          top: MediaQuery.of(context).size.height * 0.15,
                          left: 0,
                          right: 0,
                          child: Center(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(100.0),
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(
                                      color: Colors.white, width: 4.5),
                                  shape: BoxShape
                                      .circle, // Đảm bảo Container là hình tròn
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(100.0),
                                  child: (user.hinhAnhKh != null &&
                                          user.hinhAnhKh != '')
                                      ? Image.network(
                                          'http://192.168.56.1:3000/uploads/${user.hinhAnhKh}',
                                          width: MediaQuery.of(context)
                                                  .size
                                                  .width *
                                              0.35,
                                          height: MediaQuery.of(context)
                                                  .size
                                                  .width *
                                              0.35,
                                          fit: BoxFit.cover,
                                        )
                                      : Image.asset(
                                          'assets/images/avatar.jpg',
                                          width: MediaQuery.of(context)
                                                  .size
                                                  .width *
                                              0.35,
                                          height: MediaQuery.of(context)
                                                  .size
                                                  .width *
                                              0.35,
                                          fit: BoxFit.cover,
                                        ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: MediaQuery.of(context).size.height * 0.08,
                    ),
                    Center(
                      child: Text(
                        '${user.hoKh} ${user.tenKh}',
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                    ),
                    SizedBox(height: 8),
                    Center(
                      child: Text(
                        'id: ${user.id}',
                        style: TextStyle(fontSize: 14),
                      ),
                    ),
                    SizedBox(height: 20.0),
                    Padding(
                      padding: EdgeInsets.all(16.0),
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const UpdateProfileScreen(),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.black, // Đổi màu chữ
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8.0),
                            side: const BorderSide(
                                color: Colors.black, width: 1), // Thêm viền
                          ),
                        ),
                        child: SizedBox(
                          width: double.infinity,
                          height: MediaQuery.of(context).size.height * 0.07,
                          child: const Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              "Chỉnh sửa thông tin",
                              style: TextStyle(color: Colors.black), // Màu chữ
                            ),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16.0),
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  const UpdatePasswordScreen(),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: Colors.black, // Đổi màu chữ
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8.0),
                            side: const BorderSide(
                                color: Colors.black, width: 1), // Thêm viền
                          ),
                        ),
                        child: SizedBox(
                          width: double.infinity,
                          height: MediaQuery.of(context).size.height * 0.07,
                          child: const Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              "Đổi mật khẩu",
                              style: TextStyle(color: Colors.black), // Màu chữ
                            ),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: EdgeInsets.symmetric(
                          horizontal: 16.0, vertical: 16.0),
                      child: ElevatedButton(
                        onPressed: _logout,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromARGB(255, 255, 67, 67),
                          foregroundColor: Colors.white, // Đổi màu chữ
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8.0),
                            side: const BorderSide(
                                color: Colors.white, width: 1), // Thêm viền
                          ),
                        ),
                        child: SizedBox(
                          width: double.infinity,
                          height: MediaQuery.of(context).size.height * 0.07,
                          child: const Align(
                            alignment: Alignment.center,
                            child: Text(
                              "Đăng xuất",
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 18.0), // Màu chữ
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
    );
  }
}
