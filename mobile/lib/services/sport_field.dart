import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/sport_filed.dart';
import 'package:mobile/services/api.dart';
import 'package:http/http.dart' as http;

class SportFieldService extends ApiService<SportFieldBooked> {
  SportFieldService({String? token})
      : super(
            baseUrl: 'http://192.168.56.1:3000/api/admin/facility',
            token: token);

  @override
  List<SportFieldBooked> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => SportFieldBooked.fromJson(userJson)).toList();
  }

  @override
  SportFieldBooked fromJson(Map<String, dynamic> json) {
    return SportFieldBooked.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<SportFieldBooked>> getAll() async {
    return await fetchData('/');
  }

  Future<SportFieldBooked> getOne(String id) async {
    return await fetchOne('/$id');
  }

  Future<SportFieldBooked> createUser(Map<String, dynamic> userData) async {
    return await createData('/', userData);
  }

  Future<SportFieldBooked> updateUser(
      String id, Map<String, dynamic> userData) async {
    return await updateData('/$id', userData);
  }

  Future<void> deleteUser(String id) async {
    await deleteData('/$id');
  }

  Future<List<SportFieldBooked>> getAllBooked(String date) async {
    final url = Uri.parse('$baseUrl/booked?ngayDat=$date');
    try {
      final response = await http.get(url, headers: getHeaders());
      if (response.statusCode == 200 || response.statusCode == 201) {
        // return compute(parseSportFieldResponse, response.body);
        return parseSportFieldResponse(response.body);
      } else {
        throw Exception(
            'Failed to fetch data with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to fetch data due to an error: $e');
    }
  }
}

List<SportFieldBooked> parseSportFieldResponse(String responseBody) {
  try {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((json) => SportFieldBooked.fromJson(json)).toList();
  } catch (e) {
    throw Exception('Failed to parse response body: $e');
  }
}
