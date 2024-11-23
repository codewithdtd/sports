import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService<T> {
  final String baseUrl;
  String? token;
  final _storage = FlutterSecureStorage();

  ApiService({required this.baseUrl, this.token});

  Future<void> setTokens(String? refreshToken) async {
    await _storage.write(key: 'refreshToken', value: refreshToken);
  }

  Future<void> clearTokens() async {
    await _storage.delete(key: 'refreshToken');
  }

  List<T> parseResponse(String responseBody) {
    throw UnimplementedError('parseResponse must be implemented by subclasses');
  }

  T fromJson(Map<String, dynamic> json) {
    throw UnimplementedError("fromJson must be implemented in subclasses");
  }

  Map<String, String> getHeaders() {
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) {
      headers['token'] = 'Bearer $token';
    }
    return headers;
  }

  // Lấy token từ storage
  Future<String?> getRefreshToken() async {
    return await _storage.read(key: 'refreshToken');
  }

  Future<void> refreshToken() async {
    final url = Uri.parse('http://192.168.56.1:3000/api/user/refresh');
    final refreshToken = await getRefreshToken();

    if (refreshToken == null) {
      throw Exception("No refresh token found");
    }

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({"refreshToken": refreshToken}),
    );

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      token = responseData['accessToken']; // Cập nhật token mới

      // Cập nhật refreshToken nếu có cookie mới từ server
      String? setCookie = response.headers['set-cookie'];
      if (setCookie != null) {
        final newRefreshToken = extractTokenFromCookie(setCookie);
        if (newRefreshToken != null) {
          await setTokens(newRefreshToken);
        }
      }
    } else {
      throw Exception('Failed to refresh token');
    }
  }

  Future<List<T>> fetchData(String endpoint,
      {Map<String, String?>? queryParams}) async {
    final url =
        Uri.parse('$baseUrl$endpoint').replace(queryParameters: queryParams);
    try {
      var response = await http.get(url, headers: getHeaders());

      if (response.statusCode == 403) {
        await refreshToken();
        response = await http.get(url, headers: getHeaders());
      }
      if (response.statusCode == 200 || response.statusCode == 201) {
        print(response.statusCode);
        return compute(parseResponse, response.body);
      } else {
        throw Exception(
            'Failed to fetch data with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Lỗi ở service: $e');
    }
  }

  Future<T> fetchOne(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      var response = await http.get(url, headers: getHeaders());

      if (response.statusCode == 403) {
        await refreshToken();
        response = await http.get(url, headers: getHeaders());
      }
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body) as Map<String, dynamic>;
        return fromJson(data);
      } else {
        throw Exception(
            'Failed to fetch data with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to fetch data due to an error: $e');
    }
  }

  Future<T> createData(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      var response = await http.post(
        url,
        headers: getHeaders(),
        body: jsonEncode(data),
      );
      if (response.statusCode == 403) {
        await refreshToken();
        response = await http.post(
          url,
          headers: getHeaders(),
          body: jsonEncode(data),
        );
      }
      if (response.statusCode == 201 || response.statusCode == 200) {
        final responseData = json.decode(response.body) as Map<String, dynamic>;
        return fromJson(responseData);
      } else {
        throw Exception('Failed to create data ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create data due to an error: $e');
    }
  }

  Future<T> updateData(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      var response = await http.put(
        url,
        headers: getHeaders(),
        body: jsonEncode(data),
      );

      if (response.statusCode == 403) {
        await refreshToken();
        response = await http.put(
          url,
          headers: getHeaders(),
          body: jsonEncode(data),
        );
      }
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(response.body) as Map<String, dynamic>;
        return fromJson(responseData);
      } else {
        throw Exception('Failed to update data');
      }
    } catch (e) {
      throw Exception('Failed to update data due to an error: $e');
    }
  }

  Future<void> deleteData(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      var response = await http.delete(url, headers: getHeaders());

      if (response.statusCode == 403) {
        await refreshToken();
        response = await http.delete(url, headers: getHeaders());
      }
      if (response.statusCode != 200 || response.statusCode != 201) {
        throw Exception('Failed to delete data');
      }
    } catch (e) {
      throw Exception('Failed to delete data due to an error: $e');
    }
  }
}

String? extractTokenFromCookie(String setCookie) {
  final tokenRegex = RegExp(
      r'refreshToken=([^;]+)'); // Thay 'token' bằng tên cookie token từ server của bạn
  final match = tokenRegex.firstMatch(setCookie);
  return match?.group(1);
}
