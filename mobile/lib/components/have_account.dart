import 'package:flutter/material.dart';

class HaveAccount extends StatelessWidget {
  final bool login;
  final VoidCallback press;
  const HaveAccount({
    super.key,
    this.login = true,
    required this.press,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          login ? "Bạn chưa có tài khoản ?" : "Bạn đã có tài khoản ?",
          style: const TextStyle(fontSize: 16.0),
        ),
        const SizedBox(
          width: 5,
        ),
        GestureDetector(
          onTap: press,
          child: Text(
            login ? 'Đăng ký' : 'Đăng nhập',
            style: const TextStyle(
              color: Color.fromARGB(255, 48, 152, 51),
              fontWeight: FontWeight.bold,
              fontSize: 16.0,
            ),
          ),
        )
      ],
    );
  }
}
