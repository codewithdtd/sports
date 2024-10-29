import 'package:flutter/material.dart';
import 'package:mobile/Screens/User/user_screen.dart';
import 'package:mobile/Screens/Welcome/welcome_screen.dart';
import 'package:mobile/contants.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Auth',
      theme: ThemeData(
        primaryColor: dprimaryColor,
        scaffoldBackgroundColor: Colors.white,
      ),
      home: WelcomeScreen(),
      // home: UserScreen(),
    );
  }
}
