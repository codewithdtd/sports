import 'package:flutter/material.dart';
import 'package:mobile/Screens/Login/login_screen.dart';
import 'package:mobile/Screens/Signup/signup_screen.dart';
import 'package:mobile/components/rounded_button.dart';
// import 'package:flutter_svg/flutter_svg.dart';
import 'package:mobile/contants.dart';

class Body extends StatelessWidget {
  const Body({super.key});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SingleChildScrollView(
      child: Background(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Column(
              children: [
                Text(
                  "DSport",
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 60.0,
                      color: Color.fromARGB(255, 1, 220, 114)),
                ),
                Text(
                  "Nơi thõa mãn niềm đam mê thể thao của bạn",
                  style: TextStyle(
                      color: Colors.black45,
                      fontWeight: FontWeight.w600,
                      fontSize: 15.0),
                )
              ],
            ),
            const SizedBox(
              height: 15.0,
            ),
            Image.asset(
              "assets/images/login.jpg",
              width: size.width * 0.8,
            ),
            RoundedButton(
              text: 'Đăng nhập',
              color: dprimaryColor,
              textColor: Colors.white,
              press: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return LoginScreen();
                    },
                  ),
                );
              },
            ),
            RoundedButton(
              text: 'Đăng ký',
              color: dprimaryLightColor,
              textColor: Color.fromARGB(255, 0, 116, 60),
              press: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return SignUpScreen();
                    },
                  ),
                );
              },
            ),
          ],
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
          //     top: 0,
          //     child: Image.asset(
          //       'assets/images/bg-main.jpg',
          //       height: size.height * 1,
          //     ),),
          child,
        ],
      ),
    );
  }
}
