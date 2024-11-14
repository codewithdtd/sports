import 'dart:convert';
import 'package:mobile/contants.dart';
import 'package:mobile/models/time_model.dart';
import 'package:mobile/services/api.dart';

class TimeService extends ApiService<Time> {
  TimeService({String? token})
      : super(baseUrl: '${ipURL}api/admin/time', token: token);

  @override
  List<Time> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => Time.fromJson(userJson)).toList();
  }

  @override
  Time fromJson(Map<String, dynamic> json) {
    return Time.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<Time>> getAll({Map<String, String?>? queryParams}) async {
    return await fetchData('/', queryParams: queryParams);
  }
}
