import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/components/rounded_button.dart';
import 'package:mobile/components/rounded_input_field.dart';
import 'package:mobile/contants.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/user.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class UpdateProfileScreen extends StatefulWidget {
  const UpdateProfileScreen({super.key});
  @override
  _UpdateProfileScreenState createState() => _UpdateProfileScreenState();
}

class _UpdateProfileScreenState extends State<UpdateProfileScreen> {
  late final User user;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _hoController = TextEditingController();
  final TextEditingController _tenController = TextEditingController();
  final TextEditingController _sdtController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
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
        SnackBar(
          content: Text('Số điện thoại không hợp lệ !!!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    // Sử dụng Dio để gửi dữ liệu
    var dio = Dio();
    var formData = FormData();
    formData.fields.addAll([
      MapEntry('ho_KH', _hoController.text),
      MapEntry('ten_KH', _tenController.text),
      MapEntry('sdt_KH', _sdtController.text),
      MapEntry('email_KH', _emailController.text),
    ]);

    if (_avatar != null) {
      formData.files.add(MapEntry(
        'hinhAnh_KH',
        await MultipartFile.fromFile(_avatar!.path),
      ));
    }

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
          content: Text('Lỗi khi cập nhật!'),
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
      appBar: AppBar(title: Text('Cập Nhật Thông Tin')),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                GestureDetector(
                  onTap: _pickImage,
                  child: Stack(
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
                      Positioned(
                        top: 60, // Căn chỉnh để nằm giữa chiều cao
                        left: 60, // Căn chỉnh để nằm giữa chiều rộng
                        child: Icon(Icons.camera_alt, size: 30),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _hoController,
                  decoration: InputDecoration(labelText: 'Họ'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Vui lòng nhập họ';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _tenController,
                  decoration: InputDecoration(labelText: 'Tên'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Vui lòng nhập tên';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _sdtController,
                  decoration: InputDecoration(labelText: 'Số điện thoại'),
                  keyboardType: TextInputType.phone,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Vui lòng nhập số điện thoại';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _emailController,
                  decoration: InputDecoration(labelText: 'Email'),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Vui lòng nhập email';
                    }
                    return null;
                  },
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
