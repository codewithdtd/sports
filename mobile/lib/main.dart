import 'package:flutter/material.dart';
import 'package:mobile/Screens/Main/booking_screen.dart';
import 'package:mobile/Screens/User/user_screen.dart';
import 'package:mobile/Screens/Welcome/welcome_screen.dart';
import 'package:mobile/contants.dart';
import 'package:mobile/stores/user_provider.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => UserProvider())],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Flutter Auth',
        theme: ThemeData(
          primaryColor: dprimaryColor,
          scaffoldBackgroundColor: Colors.white,
        ),
        home: const AuthCheckScreen(),
        // home: UserScreen(),
      ),
    );
  }
}

class AuthCheckScreen extends StatelessWidget {
  const AuthCheckScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final isLoggedIn = userProvider.user != null;

    return isLoggedIn ? BookingScreen() : WelcomeScreen();
  }
}
