import 'dart:convert';
import 'package:mobile/models/booked_model.dart';
import 'package:mobile/models/sport_type.dart';
import 'package:mobile/services/api.dart';

class DichVuService extends ApiService<DichVu> {
  DichVuService({String? token})
      : super(
            baseUrl: 'http://192.168.56.1:3000/api/admin/service',
            token: token);

  @override
  List<DichVu> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => DichVu.fromJson(userJson)).toList();
  }

  @override
  DichVu fromJson(Map<String, dynamic> json) {
    return DichVu.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<DichVu>> getAll() async {
    return await fetchData('/');
  }

  Future<DichVu> getOne(String id) async {
    return await fetchOne('/$id');
  }

  Future<DichVu> createUser(Map<String, dynamic> userData) async {
    return await createData('/', userData);
  }

  Future<DichVu> updateUser(String id, Map<String, dynamic> userData) async {
    return await updateData('/$id', userData);
  }

  Future<void> deleteUser(String id) async {
    await deleteData('/$id');
  }
}
