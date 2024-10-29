import 'package:flutter/material.dart';
import 'package:mobile/components/text_field_container.dart';

class RoundedInputFiled extends StatelessWidget {
  final String hintText;
  final IconData icon;
  final double width;
  final double vertical;
  final ValueChanged<String> onChanged;
  final bool isPassword;
  final TextEditingController? controller;
  const RoundedInputFiled({
    super.key,
    required this.hintText,
    required this.icon,
    required this.onChanged,
    this.width = 0.8,
    this.isPassword = false,
    this.vertical = 10.0,
    this.controller,
  });

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
      vertical: vertical,
      width: width,
      child: TextField(
        controller: controller,
        onChanged: onChanged,
        obscureText: isPassword ? true : false,
        decoration: InputDecoration(
          icon: Icon(
            icon,
          ),
          hintText: hintText,
          border: InputBorder.none,
        ),
      ),
    );
  }
}
