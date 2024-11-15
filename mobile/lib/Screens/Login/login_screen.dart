import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/home_screen.dart';
import 'package:mobile/Screens/Signup/signup_screen.dart';
import 'package:mobile/components/have_account.dart';
import 'package:mobile/components/rounded_button.dart';
import 'package:mobile/components/rounded_input_field.dart';
import 'package:mobile/contants.dart';
import 'package:mobile/services/user.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<String?> validateFields() async {
    if (phoneController.text.isEmpty || passwordController.text.isEmpty) {
      return "Không được bỏ trống";
    }

    // Create the new user data
    // ignore: unused_local_variable
    final newUser = {
      'sdt_KH': phoneController.text,
      'matKhau_KH': passwordController.text,
    };

    try {
      final result = await UserService().login({
        'sdt_KH': phoneController.text,
        'matKhau_KH': passwordController.text,
      });
      return result != null
          ? "Thành công"
          : "Số điện thoại hoặc mật khẩu không đúng";
    } catch (e) {
      return "Thất bại: $e";
    }
  }

  void handleLogin(BuildContext context) async {
    final validationResult = await validateFields();

    // ignore: use_build_context_synchronously
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor:
            validationResult == "Thành công" ? Colors.green : Colors.red,
        content: Text(
          validationResult ?? "Thất bại",
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );

    if (validationResult == "Thành công") {
      // Navigate to login screen
      // ignore: use_build_context_synchronously
      final user = await UserService().login({
        'sdt_KH': phoneController.text,
        'matKhau_KH': passwordController.text,
      });
      if (user != null) {
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        userProvider.setUser(user["user"], user["token"]);
        // ignore: use_build_context_synchronously
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) {
            return HomeScreen();
          }),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      // Thay đổi Container thành Scaffold
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
              // Container(
              //   height: size.height * 0.3,
              //   width: size.width * 1.0,
              //   color: Colors.greenAccent[700],
              // ),
              Image.asset(
                'assets/images/bg-form.jpg',
                // height: size.height * 0.3,
                width: MediaQuery.of(context).size.width * 0.8,
              ),
              // const Text(
              //   "DSPORT",
              //   style: TextStyle(
              //     fontWeight: FontWeight.bold,
              //     fontSize: 60.0,
              //     color: Color.fromARGB(255, 1, 220, 114),
              //   ),
              // ),
              RoundedInputFiled(
                controller: phoneController,
                hintText: 'Số điện thoại',
                icon: Icons.phone_android,
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
                text: 'Đăng nhập',
                press: () => handleLogin(context),
                color: dprimaryColor,
                textColor: Colors.white,
              ),
              const SizedBox(
                height: 14,
              ),
              HaveAccount(
                press: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) {
                      return SignUpScreen();
                    }),
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

class Background extends StatelessWidget {
  final Widget child;
  const Background({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SizedBox(
      height: size.height,
      width: double.infinity,
      child: Stack(
        alignment: Alignment.center,
        children: <Widget>[
          // Positioned(
          //   top: 0,
          //   child: Container(
          //     height: size.height * 0.3,
          //     width: size.width * 1.0,
          //     color: Colors.greenAccent[700],
          //   ),
          // ),
          Positioned(
            top: 0,
            child: child,
          ),
        ],
      ),
    );
  }
}
