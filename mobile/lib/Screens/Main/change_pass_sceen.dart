import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/components/rounded_button.dart';
import 'package:mobile/contants.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/user.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class UpdatePasswordScreen extends StatefulWidget {
  const UpdatePasswordScreen({super.key});
  @override
  _UpdatePasswordScreenState createState() => _UpdatePasswordScreenState();
}

class _UpdatePasswordScreenState extends State<UpdatePasswordScreen> {
  late final User user;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _hoController = TextEditingController();
  final TextEditingController _tenController = TextEditingController();
  final TextEditingController _sdtController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passController = TextEditingController();
  final TextEditingController _newPassController = TextEditingController();
  final TextEditingController _confirmController = TextEditingController();
  File? _avatar; // Ảnh avatar người dùng chọn
  String? _initialAvatarUrl;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  void _loadUserData() {
    final user = Provider.of<UserProvider>(context, listen: false).user;
    _hoController.text = user!.hoKh!;
    _tenController.text = user.tenKh!;
    _sdtController.text = user.sdtKh!;
    _emailController.text = user.emailKh!;
    _initialAvatarUrl = user.hinhAnhKh;
  }

  Future<void> _pickImage() async {
    final pickedFile =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _avatar = File(pickedFile.path);
      });
    }
  }

  bool _isValidVietnamesePhoneNumber(String phoneNumber) {
    final regex = RegExp(r'^(0[3|5|7|8|9])+([0-9]{8})$');
    return regex.hasMatch(phoneNumber);
  }

  Future<void> _handleSubmit() async {
    final user = Provider.of<UserProvider>(context, listen: false).user;
    final token = Provider.of<UserProvider>(context, listen: false).token;
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    if (!_formKey.currentState!.validate()) return;

    if (!_isValidVietnamesePhoneNumber(_sdtController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Số điện thoại không hợp lệ !!!')),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    // Sử dụng Dio để gửi dữ liệu
    var formData = FormData();
    formData.fields.addAll([
      MapEntry('matKhauCu', _passController.text),
      MapEntry('matKhauMoi', _newPassController.text),
    ]);

    try {
      final response =
          await UserService(token: token).update(user!.id.toString(), formData);
      print(response.tenKh);
      userProvider.setUser(response, token);
      // if (response != null) {

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Cập nhật thành công!'),
          backgroundColor: Colors.greenAccent[700],
        ),
      );
      Navigator.of(context).pop(true);
      // } else {
      //   ScaffoldMessenger.of(context).showSnackBar(
      //     SnackBar(content: Text('Cập nhật thất bại!!!')),
      //   );
      // }
    } catch (e) {
      print('Lỗi khi cập nhật người dùng: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Mật khẩu sai hoặc có lỗi khi cập nhật!'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  @override
  void dispose() {
    _hoController.dispose();
    _tenController.dispose();
    _sdtController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Đổi mật khẩu')),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                Stack(
                  children: [
                    SizedBox(
                      height: 150,
                      width: 150,
                      child: AspectRatio(
                        aspectRatio: 1, // Tỷ lệ 1:1 để giữ ảnh hình vuông
                        child: ClipOval(
                          child: Image(
                            image: _avatar != null
                                ? FileImage(_avatar!)
                                : (_initialAvatarUrl != null
                                        ? NetworkImage(
                                            "http://192.168.56.1:3000/uploads/$_initialAvatarUrl")
                                        : AssetImage(
                                            'assets/images/bg-main.jpg'))
                                    as ImageProvider,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _passController,
                  decoration: InputDecoration(labelText: 'Mật khẩu cũ'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Vui lòng nhập mật khẩu';
                    }
                    return null;
                  },
                  obscureText: true,
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _newPassController,
                  decoration: InputDecoration(labelText: 'Mật khẩu mới'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Vui lòng nhập mật khẩu';
                    }
                    return null;
                  },
                  obscureText: true,
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _confirmController,
                  decoration:
                      InputDecoration(labelText: 'Xác nhận mật khẩu mới'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Vui lòng nhập mật khẩu';
                    }
                    if (value != _newPassController.text) {
                      return 'Mật khẩu không khớp';
                    }
                    return null;
                  },
                  obscureText: true,
                ),
                SizedBox(height: 32),
                // ElevatedButton(
                //   onPressed: _isSubmitting ? null : _handleSubmit,
                //   child: _isSubmitting
                //       ? CircularProgressIndicator()
                //       : Text('Cập Nhật'),
                // ),
                RoundedButton(
                    text: "Cập nhật",
                    press: _isSubmitting ? () {} : _handleSubmit,
                    color: dprimaryColor,
                    textColor: Colors.white)
              ],
            ),
          ),
        ),
      ),
    );
  }
}
