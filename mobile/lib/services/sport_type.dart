import 'dart:convert';
import 'package:mobile/models/sport_type.dart';
import 'package:mobile/services/api.dart';

class SportTypeService extends ApiService<SportType> {
  SportTypeService({String? token})
      : super(
            baseUrl: 'http://192.168.56.1:3000/api/admin/sportType',
            token: token);

  @override
  List<SportType> parseResponse(String responseBody) {
    var list = json.decode(responseBody) as List<dynamic>;
    return list.map((userJson) => SportType.fromJson(userJson)).toList();
  }

  @override
  SportType fromJson(Map<String, dynamic> json) {
    return SportType.fromJson(json);
  }

  // Gọi phương thức chung của ApiService
  Future<List<SportType>> getAll() async {
    return await fetchData('/');
  }

  Future<SportType> getOne(String id) async {
    return await fetchOne('/$id');
  }

  Future<SportType> createUser(Map<String, dynamic> userData) async {
    return await createData('/', userData);
  }

  Future<SportType> updateUser(String id, Map<String, dynamic> userData) async {
    return await updateData('/$id', userData);
  }

  Future<void> deleteUser(String id) async {
    await deleteData('/$id');
  }
}
