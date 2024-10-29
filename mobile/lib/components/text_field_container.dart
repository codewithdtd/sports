import 'package:flutter/material.dart';

class TextFieldContainer extends StatelessWidget {
  final Widget child;
  final double width;
  final Color? color;
  final double vertical;
  const TextFieldContainer({
    super.key,
    this.width = 0.8,
    required this.child,
    this.color,
    this.vertical = 10.0,
  });

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      margin: EdgeInsets.symmetric(vertical: vertical),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      width: size.width * width,
      decoration: BoxDecoration(
        color: color ?? Colors.greenAccent[100],
        borderRadius: BorderRadius.circular(30),
      ),
      child: child,
    );
  }
}
