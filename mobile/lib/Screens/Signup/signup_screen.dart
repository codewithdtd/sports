import 'package:flutter/material.dart';
import 'package:mobile/Screens/Login/login_screen.dart';
import 'package:mobile/components/have_account.dart';
import 'package:mobile/components/rounded_button.dart';
import 'package:mobile/components/rounded_input_field.dart';
import 'package:mobile/contants.dart';
import 'package:mobile/services/user.dart';
import 'package:mobile/models/user.dart';

class SignUpScreen extends StatelessWidget {
  SignUpScreen({super.key});

  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<String?> validateFields() async {
    if (firstNameController.text.isEmpty ||
        lastNameController.text.isEmpty ||
        phoneController.text.isEmpty ||
        passwordController.text.isEmpty) {
      return "Không được bỏ trống";
    }

    // Create the new user data
    final newUser = {
      'sdt_KH': phoneController.text,
      'matKhau_KH': passwordController.text,
      'email_KH': emailController.text,
      'ho_KH': firstNameController.text,
      'ten_KH': lastNameController.text,
    };

    try {
      User? result = await UserService().create(newUser);
      // ignore: unnecessary_null_comparison
      return result != null ? "Thành công" : "Thất bại";
    } catch (e) {
      return "Thất bại: $e";
    }
  }

  void handleSignUp(BuildContext context) async {
    final validationResult = await validateFields();

    // ignore: use_build_context_synchronously
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor:
            validationResult == "Thành công" ? Colors.green : Colors.red,
        content: Text(
          validationResult ?? "Thất bại",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );

    if (validationResult == "Thành công") {
      // Navigate to login screen
      // ignore: use_build_context_synchronously
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: const Text(""),
      ),
      backgroundColor: Colors.white,
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset(
                'assets/images/bg-form.jpg',
                width: MediaQuery.of(context).size.width * 0.8,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  RoundedInputFiled(
                    controller: firstNameController,
                    width: 0.38,
                    hintText: 'Họ',
                    icon: Icons.person,
                    onChanged: (value) {},
                  ),
                  const SizedBox(width: 7),
                  RoundedInputFiled(
                    controller: lastNameController,
                    width: 0.38,
                    hintText: 'Tên',
                    icon: Icons.person,
                    onChanged: (value) {},
                  ),
                ],
              ),
              RoundedInputFiled(
                controller: phoneController,
                hintText: 'Số điện thoại',
                icon: Icons.phone_android,
                onChanged: (value) {},
              ),
              RoundedInputFiled(
                controller: emailController,
                hintText: 'Email',
                icon: Icons.mail_outline,
                onChanged: (value) {},
              ),
              RoundedInputFiled(
                controller: passwordController,
                hintText: 'Mật khẩu',
                icon: Icons.lock_outline,
                isPassword: true,
                onChanged: (value) {},
              ),
              RoundedButton(
                text: 'Đăng ký',
                press: () => handleSignUp(context),
                color: dprimaryColor,
                textColor: Colors.white,
              ),
              const SizedBox(height: 14),
              HaveAccount(
                login: false,
                press: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginScreen()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
