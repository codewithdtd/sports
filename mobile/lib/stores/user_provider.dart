import 'package:flutter/material.dart';
import 'package:mobile/models/user.dart';

class UserProvider with ChangeNotifier {
  User? _user;
  bool _isLogin = false;
  String? _token;

  User? get user => _user;
  bool get isLogin => _isLogin;
  String? get token => _token;

  void setUser(User user, String? token) {
    _user = user;
    _token = token;
    _isLogin = true;
    notifyListeners();
  }

  void clearUser() {
    _user = null;
    _token = null;
    _isLogin = false;
    notifyListeners();
  }
}
