import 'package:flutter/material.dart';

class RoundedButton extends StatelessWidget {
  final String text;
  final VoidCallback press;
  final Color color, textColor;
  const RoundedButton({
    super.key,
    required this.text,
    required this.press,
    required this.color,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SizedBox(
      width: size.width * 0.8,
      child: Padding(
        padding:
            const EdgeInsets.only(top: 10.0), // Khoảng cách padding xung quanh
        child: TextButton(
          style: TextButton.styleFrom(
            backgroundColor: color, // Màu nền của nút
            padding: const EdgeInsets.symmetric(
                vertical: 15, horizontal: 30), // Padding bên trong nút
          ),
          onPressed: press,
          child: Text(
            text,
            style: TextStyle(color: textColor, fontSize: 20.0), // Màu chữ
          ),
        ),
      ),
    );
  }
}
