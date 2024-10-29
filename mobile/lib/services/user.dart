import 'dart:convert';
import 'package:mobile/services/api.dart';
import 'package:mobile/models/user.dart';
import 'package:http/http.dart' as http;

class UserService extends ApiService<User> {
  UserService({String? token})
      : super(baseUrl: 'http://192.168.56.1:3000/api/user', token: token);

  @override
  List<User> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => User.fromJson(userJson)).toList();
  }

  @override
  User fromJson(Map<String, dynamic> json) {
    return User.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<User>> getAll() async {
    return await fetchData('/');
  }

  Future<User> getOne(String id) async {
    return await fetchOne('/$id');
  }

  Future<User> create(Map<String, dynamic> userData) async {
    return await createData('/', userData);
  }

  Future<User> update(String id, Map<String, dynamic> userData) async {
    return await updateData('/$id', userData);
  }

  Future<void> delete(String id) async {
    await deleteData('/$id');
  }

  // Hàm đăng nhập
  Future<User?> login(Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl/login');
    try {
      final response = await http.post(
        url,
        headers: getHeaders(),
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        final userData = json.decode(response.body);
        final user = fromJson(userData);
        // Cập nhật token sau khi đăng nhập thành công
        // token = userData['token'];
        return user;
      } else {
        print('Login failed with status: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Exception during login: $e');
      return null;
    }
  }

  // Hàm đăng xuất
  Future<void> logout() async {
    final url = Uri.parse('$baseUrl/logout');
    try {
      final response = await http.post(
        url,
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        // token = null; // Xóa token để đăng xuất
        print('Logged out successfully');
      } else {
        print('Logout failed with status: ${response.statusCode}');
      }
    } catch (e) {
      print('Exception during logout: $e');
    }
  }

  // Cập nhật getHeaders để thêm token nếu có
  @override
  Map<String, String> getHeaders() {
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }
}
