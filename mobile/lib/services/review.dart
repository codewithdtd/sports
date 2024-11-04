import 'dart:convert';
import 'package:mobile/models/rating_model.dart';
import 'package:mobile/services/api.dart';
import 'package:http/http.dart' as http;

class ReviewService extends ApiService<Rating> {
  ReviewService({String? token})
      : super(
            baseUrl: 'http://192.168.56.1:3000/api/user/review', token: token);

  @override
  List<Rating> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => Rating.fromJson(userJson)).toList();
  }

  @override
  Rating fromJson(Map<String, dynamic> json) {
    return Rating.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<Rating>> getAll() async {
    return await fetchData('/');
  }

  Future<Rating> getOne(Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl/find');
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
        print('tìm: ${response.body}');
        final responseData = json.decode(response.body) as Map<String, dynamic>;
        return fromJson(responseData);
      } else {
        throw Exception('Failed to create data ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create data due to an error: $e');
    }
  }

  Future<Rating> createReview(Map<String, dynamic> userData) async {
    return await createData('/', userData);
  }

  Future<Rating> updateReview(String id, Map<String, dynamic> userData) async {
    return await updateData('/$id', userData);
  }

  Future<void> deleteReview(String id) async {
    await deleteData('/$id');
  }
}
