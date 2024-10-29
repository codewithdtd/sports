import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiService<T> {
  final String baseUrl;
  final String? token;

  ApiService({required this.baseUrl, this.token});

  List<T> parseResponse(String responseBody) {
    throw UnimplementedError('parseResponse must be implemented by subclasses');
  }

  T fromJson(Map<String, dynamic> json) {
    throw UnimplementedError("fromJson must be implemented in subclasses");
  }

  Map<String, String> getHeaders() {
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  Future<List<T>> fetchData(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.get(url, headers: getHeaders());
      if (response.statusCode == 200 || response.statusCode == 201) {
        return compute(parseResponse, response.body);
      } else {
        throw Exception(
            'Failed to fetch data with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to fetch data due to an error: $e');
    }
  }

  Future<T> fetchOne(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.get(url, headers: getHeaders());
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
      final response = await http.post(
        url,
        headers: getHeaders(),
        body: jsonEncode(data),
      );
      if (response.statusCode == 201 || response.statusCode == 200) {
        final responseData = json.decode(response.body) as Map<String, dynamic>;
        return fromJson(responseData);
      } else {
        throw Exception('Failed to create data');
      }
    } catch (e) {
      throw Exception('Failed to create data due to an error: $e');
    }
  }

  Future<T> updateData(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.put(
        url,
        headers: getHeaders(),
        body: jsonEncode(data),
      );
      if (response.statusCode == 200) {
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
      final response = await http.delete(url, headers: getHeaders());
      if (response.statusCode != 200) {
        throw Exception('Failed to delete data');
      }
    } catch (e) {
      throw Exception('Failed to delete data due to an error: $e');
    }
  }
}
